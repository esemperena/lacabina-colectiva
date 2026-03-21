import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashEmail, generarToken } from '@/lib/utils';
import { enviarInvitacionEmpleado } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ procesoId: string }> }
) {
  try {
    const { procesoId } = await params;
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    // Check proceso exists and is in fase 1
    const { data: proceso } = await supabaseAdmin
      .from('procesos')
      .select('id, fase, empresa:empresas(nombre)')
      .eq('id', procesoId)
      .single();

    if (!proceso) {
      return NextResponse.json({ error: 'Proceso no encontrado.' }, { status: 404 });
    }

    const emailNorm = email.toLowerCase().trim();
    const emailHash = hashEmail(emailNorm);
    const empresa = proceso.empresa as unknown as { nombre: string };

    // Check if already a participant
    const { data: existeParticipante } = await supabaseAdmin
      .from('participantes')
      .select('id')
      .eq('proceso_id', procesoId)
      .eq('email_hash', emailHash)
      .maybeSingle();

    if (existeParticipante) {
      // Already participating — send them a magic link instead
      const newToken = generarToken();
      await supabaseAdmin
        .from('participantes')
        .update({ token_acceso: newToken, email_contacto: emailNorm })
        .eq('id', existeParticipante.id);
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://astounding-kashata-8c4839.netlify.app';
      try {
        const { enviarMagicLink } = await import('@/lib/email');
        await enviarMagicLink(emailNorm, `${APP_URL}/api/auth/verify/${newToken}`);
      } catch { /* silent */ }
      return NextResponse.json({ ok: true });
    }

    // Check if already invited
    const { data: existeInvitacion } = await supabaseAdmin
      .from('invitaciones')
      .select('token')
      .eq('proceso_id', procesoId)
      .eq('email_hash', emailHash)
      .eq('usado', false)
      .maybeSingle();

    if (existeInvitacion) {
      // Resend existing invite
      try {
        await enviarInvitacionEmpleado(emailNorm, existeInvitacion.token, empresa?.nombre || 'tu empresa');
      } catch { /* silent */ }
      return NextResponse.json({ ok: true });
    }

    // Create new invitation
    const inviteToken = generarToken();
    await supabaseAdmin.from('invitaciones').insert({
      proceso_id: procesoId,
      email_hash: emailHash,
      token: inviteToken,
      usado: false,
    });

    try {
      await enviarInvitacionEmpleado(emailNorm, inviteToken, empresa?.nombre || 'tu empresa');
    } catch { /* silent */ }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Error en /api/invitar:', e);
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}
