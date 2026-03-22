import Link from 'next/link';

export const metadata = {
  title: 'Cómo funciona — La Cabina Colectiva',
  description: 'Guía completa del proceso de representación colectiva: fases, privacidad, rol de empleados y RRHH.',
};

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-70">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">La Cabina Colectiva</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/como-funciona" className="text-sm font-semibold text-teal-600">
                Cómo funciona
              </Link>
              <Link href="/login" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm">
                Accede a tu proceso
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-6">Guía completa</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Cómo funciona La Cabina Colectiva
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Un proceso diseñado para que los empleados puedan organizarse y negociar colectivamente con su empresa, de forma completamente segura, anónima y respaldada por la ley.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Privacidad — destacada primero */}
        <section>
          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🔒</span>
              <h2 className="text-2xl font-bold text-gray-900">Lo más importante: tu privacidad</h2>
            </div>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Antes de explicar el proceso, es fundamental entender cómo protegemos tu identidad. <strong>La empresa nunca sabrá quién inició el proceso, quién se ha unido ni qué propuestas ha enviado cada empleado</strong>, a menos que el propio empleado decida revelarlo.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-teal-200 p-5">
                <p className="text-sm font-bold text-teal-800 mb-2">🔑 Anonimidad técnica</p>
                <p className="text-sm text-gray-600">
                  Tu email nunca se guarda en texto plano en nuestra base de datos. Lo convertimos en un código irreversible (hash SHA-256) que nos permite verificar que eres un empleado de la empresa sin saber quién eres.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-teal-200 p-5">
                <p className="text-sm font-bold text-teal-800 mb-2">📬 Notificaciones voluntarias</p>
                <p className="text-sm text-gray-600">
                  Si quieres recibir emails sobre el avance del proceso, puedes acceder con tu email. En ese momento guardamos tu dirección <em>solo</em> para enviarte notificaciones. Si no accedes así, no tenemos forma de saber quién eres.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-teal-200 p-5">
                <p className="text-sm font-bold text-teal-800 mb-2">💡 Propuestas anónimas por defecto</p>
                <p className="text-sm text-gray-600">
                  Todas las propuestas se envían de forma anónima por defecto. Puedes desactivar el anonimato si quieres que tu nombre aparezca junto a tu propuesta, pero es una decisión tuya.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-teal-200 p-5">
                <p className="text-sm font-bold text-teal-800 mb-2">👁 Lo que RRHH puede ver</p>
                <p className="text-sm text-gray-600">
                  RRHH solo puede ver cuántos empleados se han unido al proceso, nunca quiénes son. Tampoco pueden ver las propuestas ni los votos hasta que el proceso haya terminado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visión general */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">El proceso en resumen</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            El proceso tiene <strong>4 fases</strong> que avanzan automáticamente o manualmente, desde que un empleado lo inicia hasta que los representantes elegidos se sientan a dialogar con la dirección. Cada fase tiene un objetivo claro y unas acciones concretas para empleados y RRHH.
          </p>

          {/* Timeline visual */}
          <div className="relative">
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {[
                { num: 1, label: 'Reunir participantes', color: 'bg-teal-600', desc: 'Se alcanza el umbral mínimo de empleados.' },
                { num: 2, label: 'Propuestas e ideas', color: 'bg-blue-600', desc: 'Los empleados envían y votan propuestas durante 2 semanas.' },
                { num: 3, label: 'Elección de representantes', color: 'bg-purple-600', desc: 'Voluntarios o sorteo según la ley.' },
                { num: 4, label: 'Diálogo con la dirección', color: 'bg-orange-600', desc: 'Los representantes negocian con la empresa.' },
              ].map(f => (
                <div key={f.num} className="flex items-start gap-5 relative">
                  <div className={`w-12 h-12 rounded-full ${f.color} text-white font-bold text-lg flex items-center justify-center flex-shrink-0 z-10`}>
                    {f.num}
                  </div>
                  <div className="pt-2.5">
                    <p className="font-bold text-gray-900">{f.label}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fase 1 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center flex-shrink-0">1</div>
            <h2 className="text-2xl font-bold text-gray-900">Fase 1 — Reunir participantes</h2>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Todo empieza cuando un empleado decide iniciar el proceso. Esta persona introduce los datos básicos de la empresa, el email de RRHH y los emails de los primeros compañeros a quienes quiere invitar. <strong>La empresa no sabrá quién lo ha iniciado.</strong>
          </p>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>👤</span> Lo que hace el empleado</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3"><span className="text-teal-600 font-bold mt-0.5">→</span><span>Rellena un formulario con el nombre de la empresa, sector, número de empleados y el email de RRHH.</span></li>
              <li className="flex gap-3"><span className="text-teal-600 font-bold mt-0.5">→</span><span>Añade los emails de los primeros compañeros que quiere invitar. A cada uno le llega un email con un enlace personal para unirse.</span></li>
              <li className="flex gap-3"><span className="text-teal-600 font-bold mt-0.5">→</span><span>Recibe un enlace de acceso a su propio dashboard, donde puede ver cuántos compañeros se han unido.</span></li>
              <li className="flex gap-3"><span className="text-teal-600 font-bold mt-0.5">→</span><span>Puede compartir el enlace de invitación con más compañeros desde su dashboard para aumentar la participación.</span></li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>🏢</span> Lo que ve RRHH</h3>
            <p className="text-gray-700">RRHH recibe un email informándoles de que se ha iniciado un proceso en su empresa. En ese email <strong>no se indica quién lo ha iniciado</strong>. Tienen acceso a un dashboard de solo lectura donde pueden ver el número de empleados unidos (pero no sus identidades), el estado de cada fase y los comunicados que quieran publicar para todos los participantes.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm text-blue-800">
              <span className="font-bold">⚖️ Umbral legal:</span> El proceso avanza automáticamente a la Fase 2 cuando se alcanza el <strong>10% de la plantilla</strong>. Este umbral es orientativo y está basado en los criterios del Estatuto de los Trabajadores para garantizar que existe representatividad suficiente.
            </p>
          </div>
        </section>

        {/* Fase 2 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">2</div>
            <h2 className="text-2xl font-bold text-gray-900">Fase 2 — Propuestas e ideas</h2>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Una vez alcanzado el umbral, todos los participantes reciben un email automático comunicándoles que el proceso ha entrado en la Fase 2. Durante <strong>2 semanas</strong>, cada empleado puede enviar hasta 6 propuestas y votar las de sus compañeros.
          </p>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>👤</span> Lo que hace el empleado</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">→</span><span>Envía hasta <strong>6 ideas, quejas, consultas o sugerencias</strong>. Puede elegir entre cuatro tipos para categorizar mejor su propuesta.</span></li>
              <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">→</span><span>Cada propuesta puede enviarse de forma <strong>anónima</strong> (por defecto) o con nombre visible, según decida el empleado en cada envío.</span></li>
              <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">→</span><span>Vota las propuestas del resto de participantes. Las propuestas con más votos aparecen primero y serán las prioritarias en el diálogo con la empresa.</span></li>
              <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">→</span><span>Cuando ya no tenga más ideas, pulsa <strong>"Ya no tengo más ideas"</strong>. Si todos los participantes lo confirman, la fase termina antes de las 2 semanas.</span></li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>🏢</span> Lo que ve RRHH</h3>
            <p className="text-gray-700">RRHH puede ver que el proceso está en la Fase 2 y cuántos empleados han confirmado que ya no tienen más ideas. <strong>No pueden ver las propuestas ni los votos</strong> hasta que la fase haya terminado. Solo ven el progreso general.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm text-blue-800">
              <span className="font-bold">⏱ Duración:</span> La Fase 2 dura un máximo de <strong>14 días</strong> desde que el proceso entra en ella. El contador se inicia automáticamente y es visible en el dashboard de cada empleado.
            </p>
          </div>
        </section>

        {/* Fase 3 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center flex-shrink-0">3</div>
            <h2 className="text-2xl font-bold text-gray-900">Fase 3 — Elección de representantes</h2>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Al terminar la Fase 2, se necesita elegir a los representantes que llevarán las propuestas más votadas a la dirección. El número de representantes necesarios está fijado por el <strong>Estatuto de los Trabajadores</strong> en función del tamaño de la empresa.
          </p>

          <div className="bg-purple-50 rounded-xl border border-purple-200 p-5 mb-6">
            <p className="text-sm font-bold text-purple-900 mb-3">📊 Representantes según la ley española</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {[
                ['6 – 30 empleados', '1 representante'],
                ['31 – 49 empleados', '3 representantes'],
                ['50 – 100 empleados', '5 representantes'],
                ['101 – 250 empleados', '9 representantes'],
                ['251 – 500 empleados', '13 representantes'],
                ['501 – 750 empleados', '17 representantes'],
                ['751 – 1.000 empleados', '21 representantes'],
                ['+1.000 empleados', '21 + 3 por cada 1.000'],
              ].map(([size, reps]) => (
                <div key={size} className="bg-white rounded-lg border border-purple-100 px-3 py-2">
                  <p className="text-gray-500 text-xs">{size}</p>
                  <p className="font-semibold text-purple-900 text-xs mt-0.5">{reps}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>👤</span> Lo que hace el empleado</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3"><span className="text-purple-600 font-bold mt-0.5">→</span><span>Puede presentarse como voluntario pulsando <strong>"Quiero ser Representante"</strong>. Una gráfica circular muestra en tiempo real cuántos voluntarios hay y cuántos se necesitan.</span></li>
              <li className="flex gap-3"><span className="text-purple-600 font-bold mt-0.5">→</span><span>Si hay suficientes voluntarios, se procede a una votación entre todos los participantes para elegir a los definitivos.</span></li>
              <li className="flex gap-3"><span className="text-purple-600 font-bold mt-0.5">→</span><span>Si no hay suficientes voluntarios, se realiza un <strong>sorteo aleatorio</strong> entre todos los participantes para cubrir los puestos necesarios.</span></li>
              <li className="flex gap-3"><span className="text-purple-600 font-bold mt-0.5">→</span><span>Los empleados pueden seguir viendo las propuestas de la Fase 2 como referencia durante todo este proceso.</span></li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>🏢</span> Lo que ve RRHH</h3>
            <p className="text-gray-700">RRHH puede ver que la empresa está en proceso de elección de representantes y cuántos voluntarios hay. <strong>No puede ver quiénes son los voluntarios</strong> hasta que el proceso no haya concluido esta fase.</p>
          </div>
        </section>

        {/* Fase 4 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center flex-shrink-0">4</div>
            <h2 className="text-2xl font-bold text-gray-900">Fase 4 — Diálogo con la dirección</h2>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Los representantes elegidos se reúnen con la dirección de la empresa armados con las propuestas más votadas por sus compañeros. Esta fase es el núcleo del proceso: <strong>un diálogo estructurado, transparente y con base legal</strong>.
          </p>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>👤</span> Lo que hacen los representantes</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3"><span className="text-orange-600 font-bold mt-0.5">→</span><span>Presentan las propuestas más votadas de sus compañeros a la dirección, en orden de prioridad según los votos recibidos.</span></li>
              <li className="flex gap-3"><span className="text-orange-600 font-bold mt-0.5">→</span><span>Negocian acuerdos concretos: mejoras salariales, flexibilidad horaria, condiciones de trabajo, seguridad, etc.</span></li>
              <li className="flex gap-3"><span className="text-orange-600 font-bold mt-0.5">→</span><span>Los acuerdos alcanzados se documentan y quedan registrados en la plataforma para que todos los participantes puedan consultarlos.</span></li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>🏢</span> El rol de RRHH en esta fase</h3>
            <p className="text-gray-700">RRHH y la dirección reciben el listado de propuestas priorizadas y participan activamente en las reuniones con los representantes. Esta es la primera fase donde se produce comunicación directa entre ambas partes de forma oficial y estructurada.</p>
          </div>
        </section>

        {/* Acceso al proceso */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cómo acceder al proceso</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <p className="text-2xl mb-3">👤</p>
              <h3 className="font-bold text-gray-900 mb-3">Para empleados</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Accedes mediante un <strong>enlace mágico</strong> enviado a tu email. No hay contraseñas. Introduces tu correo, nombre y apellidos en el formulario de acceso, y recibes un enlace personal e intransferible en tu bandeja de entrada. Al hacer clic en ese enlace, entras directamente a tu dashboard.
              </p>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                <p className="text-xs text-teal-800">🔒 Tu nombre y apellidos se guardan en tu perfil y se pueden usar si decides enviar alguna propuesta de forma no anónima. No son visibles para la empresa.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <p className="text-2xl mb-3">🏢</p>
              <h3 className="font-bold text-gray-900 mb-3">Para RRHH</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                RRHH recibe en el email de notificación inicial un enlace directo a su panel de seguimiento. También puede solicitar un nuevo enlace desde la página de acceso introduciendo el email corporativo de RRHH. El panel es de <strong>solo lectura</strong> y muestra el estado del proceso sin revelar identidades.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs text-orange-800">📋 RRHH puede publicar comunicados en el tablón del proceso, que llegarán por email a todos los participantes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes adicionales */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {[
              {
                q: '¿Es legal iniciar este proceso sin permiso de la empresa?',
                a: 'Sí. El derecho a la representación colectiva está reconocido en el Estatuto de los Trabajadores (artículos 62-76). Los trabajadores tienen derecho a elegir delegados de personal o un comité de empresa sin necesidad de la autorización de la empresa. Lo que sí es obligatorio es notificar a la empresa de la apertura del proceso electoral, lo cual La Cabina Colectiva hace automáticamente.',
              },
              {
                q: '¿Puede la empresa bloquear o cancelar el proceso?',
                a: 'No. La empresa puede participar en el proceso (colaborando con RRHH), pero no puede impedir que los empleados ejerzan su derecho a la representación colectiva. Intentar obstaculizar este proceso es una práctica antisindical, sancionable por la Inspección de Trabajo.',
              },
              {
                q: '¿Qué pasa si no hay suficientes empleados que se quieran unir?',
                a: 'El proceso permanece en la Fase 1 hasta que se alcance el umbral del 10% de la plantilla. Si nunca se alcanza ese umbral, el proceso no avanza y no tiene ningún efecto. El iniciador puede seguir invitando compañeros en cualquier momento desde su dashboard.',
              },
              {
                q: '¿Puedo unirme si recibo la invitación pero el proceso ya está en Fase 2 o 3?',
                a: 'Puedes unirte al proceso en cualquier momento, pero según la fase en que esté podrás participar de formas diferentes. En la Fase 2 podrás enviar propuestas y votar; en la Fase 3 podrás presentarte como voluntario. Las fases no esperan a nadie en particular.',
              },
              {
                q: '¿La empresa puede ver quién ha votado qué propuesta?',
                a: 'No. Los votos son completamente anónimos. La empresa solo verá el resultado final: las propuestas ordenadas por número de votos. No puede saber qué empleado ha votado cada propuesta, ni siquiera en la Fase 4 cuando las propuestas se presentan en el diálogo.',
              },
              {
                q: '¿Qué pasa con mis datos cuando termina el proceso?',
                a: 'Guardamos el historial del proceso para que los participantes puedan consultarlo. Tu email (si lo facilitaste) se usa exclusivamente para enviarte notificaciones del proceso. No vendemos ni cedemos datos a terceros. Puedes solicitar la eliminación de tus datos en cualquier momento escribiéndonos.',
              },
              {
                q: '¿Necesito instalar alguna aplicación?',
                a: 'No. Todo funciona desde el navegador, en cualquier dispositivo. El acceso es mediante enlace mágico enviado por email: sin contraseñas, sin apps, sin registros adicionales.',
              },
              {
                q: '¿Cuánto cuesta usar La Cabina Colectiva?',
                a: 'Actualmente la plataforma está en fase de investigación y es gratuita. Nuestro objetivo es que el acceso a la representación colectiva sea un derecho universal y no dependa de la capacidad económica de los empleados.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">{q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 text-xl">↓</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-teal-600 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para empezar?</h2>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
            Inicia un proceso de representación colectiva en tu empresa hoy mismo. Es gratis, anónimo y está respaldado por la ley.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iniciar"
              className="bg-white text-teal-700 font-bold px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors text-lg"
            >
              Iniciar un proceso
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-700 transition-colors text-lg"
            >
              Acceder a mi proceso
            </Link>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
          <p>© 2025 La Cabina Colectiva. Todos los derechos reservados.</p>
          <p className="mt-1">La representación colectiva es un derecho. Nosotros te damos las herramientas.</p>
        </div>
      </footer>
    </div>
  );
}
