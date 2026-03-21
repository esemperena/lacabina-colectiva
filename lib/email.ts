import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM_EMAIL = 'onboarding@resend.dev'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

export async function enviarInvitacionEmpleado(
  email: string,
  tokenAcceso: string,
  nombreEmpresa: string
) {
  const enlace = `${APP_URL}/unirse/${tokenAcceso}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Tu empresa está iniciando un proceso de representación colectiva`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a2e;">La Cabina Colectiva</h1>
        <p>Hola,</p>
        <p>Un compañero/a de <strong>${nombreEmpresa}</strong> ha iniciado un proceso para crear un comité de representación interno.</p>
        <p>Puedes unirte de forma completamente <strong>anónima</strong>. La empresa no sabrá quién se ha unido.</p>
        <a href="${enlace}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Unirme al proceso
        </a>
        <p style="color: #666; font-size: 14px;">Este enlace es personal e intransferible.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
      </div>
    `,
  })
}

export async function enviarNotificacionRRHH(
  emailRRHH: string,
  tokenRRHH: string,
  nombreEmpresa: string
) {
  const enlace = `${APP_URL}/rrhh/${tokenRRHH}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: emailRRHH,
    subject: `Se ha iniciado un proceso de representación colectiva en ${nombreEmpresa}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a2e;">La Cabina Colectiva</h1>
        <p>Estimado/a equipo de Recursos Humanos de <strong>${nombreEmpresa}</strong>,</p>
        <p>Un empleado ha iniciado un proceso para crear una representación colectiva en vuestra empresa.</p>
        <p><strong>¿Qué es La Cabina Colectiva?</strong></p>
        <p>Es una plataforma que facilita la creación de comités de empresa o delegados de personal de forma ordenada, transparente y respetuosa con la privacidad de los empleados.</p>
        <p><strong>¿Qué pedimos a RRHH?</strong></p>
        <p>Vuestra colaboración compartiendo los emails corporativos de todos los empleados para que puedan participar en el proceso.</p>
        <a href="${enlace}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Ver estado del proceso
        </a>
        <p style="color: #666; font-size: 14px;">Podéis ver el número de empleados que se han unido, pero no quiénes son.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
      </div>
    `,
  })
}

export async function enviarInformeRRHH(
  emailRRHH: string,
  nombreEmpresa: string,
  informePdf: Buffer
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: emailRRHH,
    subject: `Informe de la Fase 2 — ${nombreEmpresa}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a2e;">La Cabina Colectiva</h1>
        <p>La Fase 2 del proceso ha concluido.</p>
        <p>Adjuntamos el informe con las principales inquietudes y propuestas de los empleados de <strong>${nombreEmpresa}</strong>.</p>
        <p style="color: #999; font-size: 12px;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
      </div>
    `,
    attachments: [
      {
        filename: `informe-lacabina-${nombreEmpresa.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        content: informePdf,
      },
    ],
  })
}
