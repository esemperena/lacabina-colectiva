import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = 'hola@lacabinacolectiva.es';

export async function POST(request: NextRequest) {
  try {
    const { email, asunto, mensaje } = await request.json();

    if (!email || !asunto || !mensaje) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: 'hola@lacabinacolectiva.es',
      replyTo: email,
      subject: `[Contacto] ${asunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
          <div style="background: #0d9488; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">La Cabina Colectiva — Mensaje de contacto</h1>
          </div>
          <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="margin: 0 0 8px;"><strong>De:</strong> ${email}</p>
            <p style="margin: 0 0 20px;"><strong>Asunto:</strong> ${asunto}</p>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px;">
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.7;">${mensaje}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json({ error: 'Error al enviar el mensaje.' }, { status: 500 });
  }
}
