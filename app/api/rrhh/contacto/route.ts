import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { token, nombre, mensaje, empresaNombre } = await request.json();

    if (!token || !nombre || !mensaje) {
      return NextResponse.json({ error: 'Faltan datos.' }, { status: 400 });
    }

    // Verify token_rrhh
    const { data: proceso, error: procesoError } = await supabaseAdmin
      .from('procesos')
      .select('id, empresa:empresas(nombre, rrhh_email)')
      .eq('token_rrhh', token)
      .single();

    if (!proceso || procesoError) {
      return NextResponse.json({ error: 'Token no válido.' }, { status: 403 });
    }

    const empresa = proceso.empresa as unknown as { nombre: string; rrhh_email: string };

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'esemperena4@gmail.com',
      subject: `[La Cabina Colectiva] Consulta de RRHH — ${empresa.nombre || empresaNombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">Nueva consulta de RRHH</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #374151; width: 120px;">Empresa:</td>
              <td style="padding: 8px; color: #6b7280;">${empresa.nombre || empresaNombre}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 8px; font-weight: bold; color: #374151;">Nombre:</td>
              <td style="padding: 8px; color: #6b7280;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #374151;">Email RRHH:</td>
              <td style="padding: 8px; color: #6b7280;">${empresa.rrhh_email || '—'}</td>
            </tr>
          </table>
          <div style="background: #f9fafb; border-left: 4px solid #0d9488; padding: 16px; border-radius: 4px;">
            <p style="margin: 0; color: #374151; white-space: pre-wrap;">${mensaje}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
            Este mensaje fue enviado desde el panel de RRHH de La Cabina Colectiva.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error en /api/rrhh/contacto:', err);
    return NextResponse.json({ error: 'Error al enviar el mensaje.' }, { status: 500 });
  }
}
