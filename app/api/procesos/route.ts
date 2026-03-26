import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashEmail, generarToken } from '@/lib/utils';
import { enviarBienvenidaIniciador, enviarInvitacionEmpleado, enviarNotificacionRRHH } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      nombre,
      sector,
      num_empleados,
      rrhh_email,
      iniciador_email,
      colegas_emails,
    } = body;

    // Validate required fields
    if (!nombre || !sector || !num_empleados || !rrhh_email || !iniciador_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(colegas_emails) || colegas_emails.length === 0) {
      return NextResponse.json(
        { error: 'At least one colleague email is required' },
        { status: 400 }
      );
    }

    // Validar número mínimo de empleados (ley española ET art. 62)
    if (Number(num_empleados) < 6) {
      return NextResponse.json(
        { error: 'Empresas con menos de 6 empleados no requieren representantes según la ley española (ET art. 62).' },
        { status: 400 }
      );
    }

    // Create empresa record
    const { data: empresa, error: empresaError } = await supabaseAdmin
      .from('empresas')
      .insert({
        nombre,
        sector,
        num_empleados,
        rrhh_email,
      })
      .select()
      .single();

    if (empresaError || !empresa) {
      console.error('Error creating empresa:', empresaError);
      return NextResponse.json(
        { error: 'Failed to create empresa' },
        { status: 500 }
      );
    }

    // Generate tokens
    const tokenRRHH = generarToken();
    const tokenIniciador = generarToken();

    // Create proceso record
    const { data: proceso, error: procesoError } = await supabaseAdmin
      .from('procesos')
      .insert({
        empresa_id: empresa.id,
        fase: '1',
        estado: 'activo',
        token_rrhh: tokenRRHH,
        empleados_objetivo: num_empleados,
        empleados_unidos: 0,
      })
      .select()
      .single();

    if (procesoError || !proceso) {
      console.error('Error creating proceso:', procesoError);
      return NextResponse.json(
        { error: 'Failed to create proceso' },
        { status: 500 }
      );
    }

    // Hash initiator email and create participante record
    const emailHashInitiador = hashEmail(iniciador_email);
    const { error: participanteError } = await supabaseAdmin
      .from('participantes')
      .insert({
        proceso_id: proceso.id,
        email_hash: emailHashInitiador,
        token_acceso: tokenIniciador,
        es_iniciador: true,
        es_rrhh: false,
        email_contacto: iniciador_email.toLowerCase().trim(),
      });

    if (participanteError) {
      console.error('Error creating initiator participante:', participanteError);
      return NextResponse.json(
        { error: 'Failed to create participante' },
        { status: 500 }
      );
    }

    // Enviar email al iniciador — mismo flujo que los compañeros (/unirse/[token])
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://lacabinacolectiva.es';
    try {
      await enviarBienvenidaIniciador(iniciador_email, tokenIniciador, nombre);
    } catch (emailError) {
      console.error('Error sending initiator access email:', emailError);
    }

    // Create invitations for colleagues and send emails
    for (const colegaEmail of colegas_emails) {
      const emailHash = hashEmail(colegaEmail);
      const invitacionToken = generarToken();

      // Insert invitation
      const { error: invitacionError } = await supabaseAdmin
        .from('invitaciones')
        .insert({
          proceso_id: proceso.id,
          email_hash: emailHash,
          token: invitacionToken,
          usado: false,
        });

      if (invitacionError) {
        console.error('Error creating invitacion:', invitacionError);
        // Continue with other invitations even if one fails
        continue;
      }

      // Send invitation email (non-blocking)
      try {
        await enviarInvitacionEmpleado(colegaEmail, invitacionToken, nombre);
      } catch (emailError) {
        console.error('Error sending invitation email to', colegaEmail, emailError);
        // Don't fail the entire request if email sending fails
      }
    }

    // Send RRHH notification (non-blocking)
    try {
      await enviarNotificacionRRHH(rrhh_email, tokenRRHH, nombre);
    } catch (emailError) {
      console.error('Error sending RRHH notification email:', emailError);
      // Don't fail the entire request if email sending fails
    }

    return NextResponse.json({
      success: true,
      proceso_id: proceso.id,
      token_iniciador: tokenIniciador,
      message: 'Proceso created successfully. Invitations sent to colleagues.',
    });
  } catch (error) {
    console.error('Error creating proceso:', error);
    return NextResponse.json(
      { error: 'Failed to create proceso' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const procesoId = searchParams.get('id');

    if (!procesoId) {
      return NextResponse.json(
        { error: 'Proceso ID is required' },
        { status: 400 }
      );
    }

    // Fetch proceso with empresa join
    const { data: proceso, error } = await supabaseAdmin
      .from('procesos')
      .select('*, empresa:empresas(*)')
      .eq('id', procesoId)
      .single();

    if (error || !proceso) {
      console.error('Error fetching proceso:', error);
      return NextResponse.json(
        { error: 'Proceso not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(proceso);
  } catch (error) {
    console.error('Error fetching proceso:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proceso' },
      { status: 500 }
    );
  }
}
