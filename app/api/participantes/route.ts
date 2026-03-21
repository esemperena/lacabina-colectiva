import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generarToken } from '@/lib/utils';
import { enviarEmailInicioFase2 } from '@/lib/email';

const UMBRAL_PORCENTAJE = 0.10 // 10% de participación activa la fase 2

async function intentarTransicionFase2(procesoId: string) {
  // Fetch proceso actual
  const { data: proceso } = await supabaseAdmin
    .from('procesos')
    .select('id, fase, empleados_unidos, empleados_objetivo, empresa:empresas(nombre)')
    .eq('id', procesoId)
    .single()

  if (!proceso || proceso.fase !== '1') return

  const umbral = Math.ceil(proceso.empleados_objetivo * UMBRAL_PORCENTAJE)
  if (proceso.empleados_unidos < umbral) return

  // Transition to fase 2
  const ahora = new Date().toISOString()
  await supabaseAdmin
    .from('procesos')
    .update({ fase: '2', fase2_inicio: ahora })
    .eq('id', procesoId)

  // Send emails to all participants that have email_contacto stored
  const { data: participantes } = await supabaseAdmin
    .from('participantes')
    .select('id, token_acceso, email_contacto')
    .eq('proceso_id', procesoId)
    .not('email_contacto', 'is', null)

  if (!participantes) return

  const empresa = proceso.empresa as unknown as { nombre: string }
  const nombreEmpresa = empresa?.nombre || 'tu empresa'
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://astounding-kashata-8c4839.netlify.app'

  for (const p of participantes) {
    if (!p.email_contacto) continue
    // Invite link — we use a generic new invitation token for sharing
    const enlaceInvitacion = `${APP_URL}/login`
    try {
      await enviarEmailInicioFase2(p.email_contacto, p.token_acceso, enlaceInvitacion, nombreEmpresa)
    } catch (e) {
      console.error('Error sending fase2 email to', p.email_contacto, e)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, nombre, edad, sexo } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
    }

    // Look up invitacion
    const { data: invitacion, error: invitacionError } = await supabaseAdmin
      .from('invitaciones')
      .select('*')
      .eq('token', token)
      .eq('usado', false)
      .single();

    if (invitacionError || !invitacion) {
      return NextResponse.json({ error: 'Token inválido o ya utilizado' }, { status: 400 });
    }

    // Generate access token for participant
    const tokenAcceso = generarToken();

    // Insert participante
    const { data: participante, error: participanteError } = await supabaseAdmin
      .from('participantes')
      .insert({
        proceso_id: invitacion.proceso_id,
        email_hash: invitacion.email_hash,
        token_acceso: tokenAcceso,
        es_iniciador: false,
        es_rrhh: false,
        nombre: nombre || null,
        edad: edad || null,
        sexo: sexo || null,
      })
      .select()
      .single();

    if (participanteError || !participante) {
      return NextResponse.json({ error: 'Failed to join proceso' }, { status: 500 });
    }

    // Mark invitacion as used
    await supabaseAdmin.from('invitaciones').update({ usado: true }).eq('id', invitacion.id);

    // Check if this new participant triggers the fase 1→2 transition
    // (done async — don't block the response)
    intentarTransicionFase2(invitacion.proceso_id).catch(e =>
      console.error('Error en transición fase 1→2:', e)
    )

    return NextResponse.json({
      success: true,
      participante_id: participante.id,
      proceso_id: participante.proceso_id,
      token_acceso: tokenAcceso,
    });
  } catch (error) {
    console.error('Error joining proceso:', error);
    return NextResponse.json({ error: 'Failed to join proceso' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const procesoId = searchParams.get('proceso_id');

    if (!procesoId) {
      return NextResponse.json({ error: 'Proceso ID is required' }, { status: 400 });
    }

    const { count, error } = await supabaseAdmin
      .from('participantes')
      .select('id', { count: 'exact' })
      .eq('proceso_id', procesoId);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch participantes count' }, { status: 500 });
    }

    return NextResponse.json({ total: count || 0, proceso_id: procesoId });
  } catch (error) {
    console.error('Error fetching participantes:', error);
    return NextResponse.json({ error: 'Failed to fetch participantes' }, { status: 500 });
  }
}
