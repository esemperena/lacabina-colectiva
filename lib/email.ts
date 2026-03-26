import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
export const FROM_EMAIL = 'hola@lacabinacolectiva.es'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://lacabinacolectiva.es'

export async function enviarInvitacionEmpleado(
  email: string,
  tokenAcceso: string,
  nombreEmpresa: string
) {
  const enlace = `${APP_URL}/unirse/${tokenAcceso}`
  const enlaceComoFunciona = `${APP_URL}/como-funciona`
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Tu empresa está iniciando un proceso de representación colectiva`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        <div style="background: #0d9488; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">La Cabina Colectiva</h1>
        </div>
        <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Un compañero/a te invita a participar</h2>
          <p style="color: #4b5563;">Hola,</p>
          <p style="color: #4b5563;">Un compañero/a de <strong>${nombreEmpresa}</strong> ha iniciado un proceso para elegir representantes de los empleados a través de La Cabina Colectiva.</p>

          <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 6px; color: #134e4a; font-weight: bold;">¿Qué pasa si hago clic?</p>
            <ol style="margin: 0; padding-left: 18px; color: #134e4a; font-size: 14px; line-height: 1.8;">
              <li>Accedes a un formulario breve donde puedes añadir tus datos.</li>
              <li>Te unes al proceso de forma confidencial — la empresa no sabrá que participas si no quieres.</li>
              <li>Podrás enviar propuestas, votar y, si quieres, presentarte como representante.</li>
            </ol>
          </div>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 18px; margin: 16px 0;">
            <p style="margin: 0; color: #6b7280; font-size: 13px;">🔒 <strong>Tu participación es confidencial.</strong> La empresa solo verá el número total de participantes, nunca quiénes son.</p>
          </div>

          <div style="margin: 24px 0;">
            <a href="${enlace}" style="display: inline-block; padding: 14px 28px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; margin-right: 12px;">
              Unirme al proceso →
            </a>
            <a href="${enlaceComoFunciona}" style="display: inline-block; padding: 14px 28px; background-color: #f3f4f6; color: #374151; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; border: 1px solid #d1d5db;">
              Cómo funciona
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 12px;">Este enlace es personal e intransferible. Si no quieres participar, simplemente ignora este email.</p>

          <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
        </div>
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
  const enlaceComoFunciona = `${APP_URL}/como-funciona`
  await resend.emails.send({
    from: FROM_EMAIL,
    to: emailRRHH,
    subject: `Se ha iniciado un proceso de representación colectiva en ${nombreEmpresa}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        <div style="background: #0d9488; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">La Cabina Colectiva</h1>
        </div>
        <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Se ha iniciado un proceso de representación colectiva en ${nombreEmpresa}</h2>
          <p style="color: #4b5563;">Estimado/a equipo de Recursos Humanos,</p>
          <p style="color: #4b5563;">Un empleado de <strong>${nombreEmpresa}</strong> ha iniciado un proceso para constituir una representación colectiva a través de La Cabina Colectiva.</p>

          <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 8px; color: #134e4a; font-weight: bold;">¿Qué es La Cabina Colectiva?</p>
            <p style="margin: 0; color: #134e4a; font-size: 14px;">Una plataforma que facilita la creación de comités de empresa o delegados de personal de forma ordenada, transparente y digital. El proceso respeta en todo momento la privacidad de los empleados: RRHH puede ver cuántos participan, pero nunca quiénes son.</p>
          </div>

          <p style="color: #4b5563; font-weight: bold;">¿Qué os pedimos?</p>
          <p style="color: #4b5563; font-size: 14px;">Colaborar compartiendo los emails corporativos de vuestros empleados para que puedan ser invitados a participar. Accedéis al portal de RRHH con el botón de abajo.</p>

          <div style="margin: 24px 0;">
            <a href="${enlace}" style="display: inline-block; padding: 14px 28px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; margin-right: 12px;">
              Ver estado del proceso →
            </a>
            <a href="${enlaceComoFunciona}" style="display: inline-block; padding: 14px 28px; background-color: #f3f4f6; color: #374151; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; border: 1px solid #d1d5db;">
              Cómo funciona
            </a>
          </div>

          <p style="color: #6b7280; font-size: 13px;">Si tenéis preguntas, podéis responder a este email o contactarnos en <a href="mailto:hola@lacabinacolectiva.es" style="color: #0d9488;">hola@lacabinacolectiva.es</a>.</p>

          <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
        </div>
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
        <h1 style="color: #0d9488;">La Cabina Colectiva</h1>
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

export async function enviarBienvenidaIniciador(
  email: string,
  tokenAcceso: string,
  nombreEmpresa: string
) {
  const enlace = `${APP_URL}/unirse/${tokenAcceso}`
  const enlaceComoFunciona = `${APP_URL}/como-funciona`
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Has iniciado un proceso de representación en ${nombreEmpresa} — completa tu registro`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        <div style="background: #0d9488; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">La Cabina Colectiva</h1>
        </div>
        <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">¡Has iniciado el proceso en ${nombreEmpresa}!</h2>
          <p style="color: #4b5563;">El proceso de representación colectiva está en marcha. Ahora necesitas completar tu propio registro como participante.</p>

          <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 8px; color: #134e4a; font-weight: bold;">¿Qué pasa ahora?</p>
            <ol style="margin: 0; padding-left: 18px; color: #134e4a; font-size: 14px; line-height: 1.9;">
              <li><strong>Completa tu registro</strong> — introduce tu nombre y apellidos en el formulario.</li>
              <li><strong>Tus compañeros reciben la invitación</strong> — los emails que añadiste ya tienen su enlace para unirse.</li>
              <li><strong>El proceso avanza</strong> cuando se alcance el mínimo de participantes necesarios.</li>
            </ol>
          </div>

          <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 14px 18px; margin: 16px 0;">
            <p style="margin: 0 0 6px; color: #92400e; font-weight: bold;">🔒 Tu identidad está protegida</p>
            <p style="margin: 0; color: #78350f; font-size: 13px; line-height: 1.6;">Ni la empresa ni tus compañeros sabrán que has sido tú quien ha iniciado este proceso. Para todos, eres un participante más. La plataforma nunca revela quién lo inició.</p>
          </div>

          <div style="margin: 24px 0;">
            <a href="${enlace}" style="display: inline-block; padding: 14px 28px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; margin-right: 12px;">
              Completar mi registro →
            </a>
            <a href="${enlaceComoFunciona}" style="display: inline-block; padding: 14px 28px; background-color: #f3f4f6; color: #374151; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; border: 1px solid #d1d5db;">
              Cómo funciona
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 12px;">Este enlace es personal. Si tienes alguna duda, escríbenos a <a href="mailto:hola@lacabinacolectiva.es" style="color: #0d9488;">hola@lacabinacolectiva.es</a>.</p>

          <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
        </div>
      </div>
    `,
  })
}

export async function enviarMagicLink(email: string, link: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Tu enlace de acceso — La Cabina Colectiva',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        <div style="background: #0d9488; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">La Cabina Colectiva</h1>
        </div>
        <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Tu enlace de acceso está listo</h2>
          <p style="color: #4b5563;">Haz clic en el botón para entrar directamente a tu dashboard del proceso. No necesitas contraseña.</p>

          <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #134e4a; font-size: 14px;"><strong>¿Qué ocurre al hacer clic?</strong></p>
            <p style="margin: 8px 0 0; color: #134e4a; font-size: 14px;">Accedes directamente a tu espacio personal dentro del proceso de representación colectiva. Desde ahí podrás ver el estado, enviar propuestas o participar en la elección de representantes según la fase en que esté el proceso.</p>
          </div>

          <a href="${link}" style="display:inline-block; padding:14px 28px; background:#0d9488; color:white; text-decoration:none; border-radius:8px; margin: 8px 0; font-weight: bold; font-size: 16px;">
            Acceder al proceso →
          </a>

          <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">⚠️ Este enlace es de <strong>un solo uso</strong> y caduca en 24 horas. Si necesitas un nuevo enlace, vuelve a solicitarlo desde la página de acceso.</p>
          <p style="color: #9ca3af; font-size: 12px;">Si no solicitaste este enlace, ignora este email.</p>

          <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
        </div>
      </div>
    `,
  })
}

export async function enviarEmailAnuncioRRHH(
  email: string,
  tokenAcceso: string,
  nombreEmpresa: string,
  contenidoAnuncio: string
) {
  const enlaceAcceso = `${APP_URL}/api/auth/verify/${tokenAcceso}`
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `📢 Nuevo comunicado de RRHH — ${nombreEmpresa}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0d9488;">La Cabina Colectiva</h1>
        <h2 style="color: #1f2937;">Comunicado de Recursos Humanos</h2>
        <p>El departamento de RRHH de <strong>${nombreEmpresa}</strong> ha publicado un mensaje en el tablón del proceso:</p>

        <div style="background: #f8fafc; border-left: 4px solid #0d9488; padding: 16px 20px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #1f2937; margin: 0; white-space: pre-wrap;">${contenidoAnuncio}</p>
        </div>

        <a href="${enlaceAcceso}" style="display: inline-block; padding: 12px 24px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Ver en mi dashboard →
        </a>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
      </div>
    `,
  })
}

export async function enviarEmailInicioFase2(
  email: string,
  tokenAcceso: string,
  enlaceInvitacion: string,
  nombreEmpresa: string
) {
  const enlaceAcceso = `${APP_URL}/api/auth/verify/${tokenAcceso}`
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `🗳️ Fase 2 activa — Ya puedes enviar tus propuestas en ${nombreEmpresa}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0d9488;">La Cabina Colectiva</h1>
        <h2 style="color: #1f2937;">¡Hemos pasado a la Fase 2!</h2>
        <p>El proceso de representación colectiva en <strong>${nombreEmpresa}</strong> ha alcanzado el número mínimo de participantes y ahora entra en la <strong>Fase 2: Propuestas</strong>.</p>

        <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; color: #134e4a;"><strong>¿Qué puedes hacer ahora?</strong></p>
          <ul style="color: #134e4a; margin-top: 8px;">
            <li>Enviar hasta <strong>6 ideas, quejas, consultas o sugerencias</strong> de forma anónima o con tu nombre.</li>
            <li>Votar las propuestas de tus compañeros para priorizar las más importantes.</li>
            <li>Invitar a compañeros que aún no se han unido para que también puedan participar.</li>
          </ul>
        </div>

        <p style="color: #6b7280;">Esta fase dura <strong>2 semanas</strong> o hasta que todos los participantes indiquen que ya no tienen más propuestas.</p>

        <a href="${enlaceAcceso}" style="display: inline-block; padding: 12px 24px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Ir a mis propuestas →
        </a>

        <p style="color: #6b7280; font-size: 14px;">¿Tienes compañeros que aún no se han unido? Compárteles este enlace de invitación:<br/>
        <a href="${enlaceInvitacion}" style="color: #0d9488;">${enlaceInvitacion}</a></p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
      </div>
    `,
  })
}

export async function enviarEmailInicioFase3(
  email: string,
  tokenAcceso: string,
  nombreEmpresa: string
) {
  const enlaceAcceso = `${APP_URL}/api/auth/verify/${tokenAcceso}`
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `🙋 Fase 3 activa — Elige a tus representantes en ${nombreEmpresa}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0d9488;">La Cabina Colectiva</h1>
        <h2 style="color: #1f2937;">¡Pasamos a la Fase 3!</h2>
        <p>La fase de propuestas ha concluido en <strong>${nombreEmpresa}</strong>. Ahora entramos en la <strong>Fase 3: Representantes</strong>.</p>

        <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; color: #134e4a;"><strong>¿Qué ocurre ahora?</strong></p>
          <ul style="color: #134e4a; margin-top: 8px;">
            <li>Cualquier empleado puede presentarse como <strong>candidato a representante</strong>.</li>
            <li>Si hay candidatos, el resto vota para elegir a sus favoritos.</li>
            <li>Si no hay suficientes voluntarios, se realiza un sorteo entre todos los participantes.</li>
            <li>Los representantes elegidos llevarán las propuestas más votadas a la dirección.</li>
          </ul>
        </div>

        <a href="${enlaceAcceso}" style="display: inline-block; padding: 12px 24px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Ver el proceso →
        </a>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
      </div>
    `,
  })
}

export async function enviarEmailSorteoRepresentante(
  email: string,
  tokenAcceso: string,
  enlaceAcceso: string,
  nombreEmpresa: string
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Has sido seleccionado por sorteo como representante — ${nombreEmpresa}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0d9488;">La Cabina Colectiva</h1>
        <h2 style="color: #1f2937;">Has sido seleccionado como representante</h2>
        <p>En el proceso de representación colectiva de <strong>${nombreEmpresa}</strong>, no se presentaron suficientes voluntarios, por lo que se ha realizado un <strong>sorteo aleatorio</strong> entre todos los participantes.</p>
        <div style="background: #faf5ff; border-left: 4px solid #9333ea; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; color: #581c87;"><strong>Has sido elegido/a para representar a tus compañeros.</strong></p>
          <p style="margin: 8px 0 0; color: #6b21a8;">Entra en tu dashboard para aceptar o rechazar el cargo. Si rechazas, se realizará un nuevo sorteo.</p>
        </div>
        <a href="${enlaceAcceso}" style="display: inline-block; padding: 12px 24px; background-color: #9333ea; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Ver mi dashboard →
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">La Cabina Colectiva — Representación colectiva para empresas modernas</p>
      </div>
    `,
  })
}
