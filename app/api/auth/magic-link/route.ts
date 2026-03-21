import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashEmail, generarToken } from '@/lib/utils';
import { enviarMagicLink } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, tipo } = body;

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (tipo === 'empleado') {
      // Hash email for employee lookup
      const emailHash = hashEmail(email);

      // Look up participante by email hash
      const { data: participante, error: participanteError } = await supabaseAdmin
        .from('participantes')
        .select('id, proceso_id, nombre')
        .eq('email_hash', emailHash)
        .single();

      // If not in participantes, check if they have a pending invitation
      if (!participante || participanteError) {
        const { data: invitacion } = await supabaseAdmin
          .from('invitaciones')
          .select('token')
          .eq('email_hash', emailHash)
          .eq('usado', false)
          .single();

        if (invitacion) {
          // They were invited but haven't joined yet — send them the join link
          const joinLink = `${APP_URL}/unirse/${invitacion.token}`
          try {
            await enviarMagicLink(email, joinLink)
          } catch (e) {
            console.error('Error sending join link:', e)
          }
        }

        // Always return success (security: don't reveal if email exists)
        return NextResponse.json(
          { success: true, message: 'Si tu email está registrado, recibirás un enlace en breve.' },
          { status: 200 }
        );
      }

      // Generate new token
      const newToken = generarToken();

      // Update participante with new token
      const { error: updateError } = await supabaseAdmin
        .from('participantes')
        .update({ token_acceso: newToken })
        .eq('id', participante.id);

      if (updateError) {
        console.error('Error updating token:', updateError);
        return NextResponse.json(
          {
            success: true,
            message: 'Si tu email está registrado, recibirás un enlace en breve.',
          },
          { status: 200 }
        );
      }

      // Send magic link email
      const link = `${APP_URL}/api/auth/verify/${newToken}`;
      try {
        await enviarMagicLink(email, link);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Still return success to not reveal email existence
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Si tu email está registrado, recibirás un enlace en breve.',
        },
        { status: 200 }
      );
    } else if (tipo === 'rrhh') {
      // Look up empresa by rrhh_email
      const { data: empresa, error: empresaError } = await supabaseAdmin
        .from('empresas')
        .select('id, nombre')
        .eq('rrhh_email', email.toLowerCase().trim())
        .single();

      // Security: don't reveal if email exists
      if (!empresa || empresaError) {
        return NextResponse.json(
          {
            success: true,
            message: 'Si tu email está registrado, recibirás un enlace en breve.',
          },
          { status: 200 }
        );
      }

      // Get proceso for this empresa
      const { data: proceso, error: procesoError } = await supabaseAdmin
        .from('procesos')
        .select('id, token_rrhh')
        .eq('empresa_id', empresa.id)
        .single();

      if (!proceso || procesoError) {
        return NextResponse.json(
          {
            success: true,
            message: 'Si tu email está registrado, recibirás un enlace en breve.',
          },
          { status: 200 }
        );
      }

      // Send magic link email with RRHH token
      const link = `${APP_URL}/rrhh/${proceso.token_rrhh}`;
      try {
        await enviarMagicLink(email, link);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Still return success to not reveal email existence
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Si tu email está registrado, recibirás un enlace en breve.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Tipo de login inválido' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in magic-link route:', error);
    return NextResponse.json(
      {
        success: true,
        message: 'Si tu email está registrado, recibirás un enlace en breve.',
      },
      { status: 200 }
    );
  }
}
