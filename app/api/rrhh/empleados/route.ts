import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashEmail, generarToken } from '@/lib/utils';
import { enviarInvitacionEmpleado } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { token, emails } = await request.json();

    if (!token || !emails) {
      return NextResponse.json({ error: 'Faltan datos.' }, { status: 400 });
    }

    // Verify token_rrhh
    const { data: proceso, error: procesoError } = await supabaseAdmin
      .from('procesos')
      .select('id, empleados_objetivo, empresa:empresas(nombre, rrhh_email)')
      .eq('token_rrhh', token)
      .single();

    if (!proceso || procesoError) {
      return NextResponse.json({ error: 'Token no válido.' }, { status: 403 });
    }

    // Parse emails - accept newlines and/or commas
    const emailList = emails
      .split(/[\n,]+/)
      .map((e: string) => e.trim().toLowerCase())
      .filter((e: string) => e.includes('@') && e.length > 5);

    if (emailList.length === 0) {
      return NextResponse.json({ error: 'No se encontraron emails válidos.' }, { status: 400 });
    }

    const empresaData = proceso.empresa as unknown as { nombre: string };
    const nombreEmpresa = empresaData?.nombre || 'tu empresa';
    let enviados = 0;
    let duplicados = 0;

    for (const email of emailList) {
      const emailHash = await hashEmail(email);

      // Check if already a participante
      const { data: existeParticipante } = await supabaseAdmin
        .from('participantes')
        .select('id')
        .eq('proceso_id', proceso.id)
        .eq('email_hash', emailHash)
        .maybeSingle();

      if (existeParticipante) {
        duplicados++;
        continue;
      }

      // Check if already invited
      const { data: existeInvitacion } = await supabaseAdmin
        .from('invitaciones')
        .select('id')
        .eq('proceso_id', proceso.id)
        .eq('email_hash', emailHash)
        .maybeSingle();

      if (existeInvitacion) {
        duplicados++;
        continue;
      }

      // Create invitation
      const inviteToken = generarToken();
      const { error: invError } = await supabaseAdmin
        .from('invitaciones')
        .insert({
          proceso_id: proceso.id,
          email_hash: emailHash,
          token: inviteToken,
          usado: false,
        });

      if (invError) continue;

      // Send invite email
      try {
        await enviarInvitacionEmpleado(email, inviteToken, nombreEmpresa);
        enviados++;
      } catch {
        // Email failed but invitation record exists
        enviados++;
      }
    }

    return NextResponse.json({
      ok: true,
      enviados,
      duplicados,
      total: emailList.length,
    });
  } catch (err) {
    console.error('Error en /api/rrhh/empleados:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
