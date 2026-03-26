import Link from 'next/link';
import { LogoLink } from '@/components/Logo';
import DashboardCarousel from './DashboardCarousel';

export const metadata = {
  title: 'Cómo funciona — La Cabina Colectiva',
  description: 'Guía completa del proceso de representación colectiva: fases, privacidad, rol de empleados y RRHH.',
};

// ── Paleta armónica de fases (analogous: emerald → teal → cyan → sky) ──────
const FASES = [
  {
    num: 1, label: 'Reunir participantes', desc: 'Se alcanza el umbral mínimo de empleados.',
    color: 'bg-emerald-600', text: 'text-emerald-700', arrow: 'text-emerald-500',
    light: 'bg-emerald-50 border-emerald-200', noteLight: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    title: 'Fase 1 — Reunir participantes', titleColor: 'text-emerald-800',
  },
  {
    num: 2, label: 'Propuestas e ideas', desc: 'Los empleados envían y votan propuestas durante 2 semanas.',
    color: 'bg-teal-600', text: 'text-teal-700', arrow: 'text-teal-500',
    light: 'bg-teal-50 border-teal-200', noteLight: 'bg-teal-50 border-teal-200 text-teal-900',
    title: 'Fase 2 — Propuestas e ideas', titleColor: 'text-teal-800',
  },
  {
    num: 3, label: 'Elección de representantes', desc: 'Voluntarios o sorteo según la ley.',
    color: 'bg-cyan-700', text: 'text-cyan-700', arrow: 'text-cyan-600',
    light: 'bg-cyan-50 border-cyan-200', noteLight: 'bg-cyan-50 border-cyan-200 text-cyan-900',
    title: 'Fase 3 — Elección de representantes', titleColor: 'text-cyan-800',
  },
  {
    num: 4, label: 'Diálogo con la dirección', desc: 'Los representantes negocian con la empresa.',
    color: 'bg-sky-700', text: 'text-sky-700', arrow: 'text-sky-600',
    light: 'bg-sky-50 border-sky-200', noteLight: 'bg-sky-50 border-sky-200 text-sky-900',
    title: 'Fase 4 — Diálogo con la dirección', titleColor: 'text-sky-800',
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <LogoLink />
            <nav className="flex items-center gap-6">
              <Link href="/como-funciona" className="text-sm font-semibold text-teal-600">Cómo funciona</Link>
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
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">Cómo funciona La Cabina Colectiva</h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Un proceso diseñado para que los empleados puedan organizarse y negociar colectivamente con su empresa, de forma completamente segura, confidencial y respaldada por la ley.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ── Privacidad simplificada ─────────────────────────────────────── */}
        <section>
          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔒</span>
              <h2 className="text-xl font-bold text-gray-900">Lo más importante: tu privacidad</h2>
            </div>
            <p className="text-gray-600 mb-5">
              La empresa <strong>nunca sabrá</strong> quién inició el proceso, quién participa ni qué vota cada empleado.
            </p>
            <div className="space-y-2.5">
              {[
                'Tu empresa no puede saber quién ha iniciado el proceso ni quién participa.',
                'Tu nombre y tus datos se guardan en la plataforma, pero nunca se comparten con tu empresa sin tu consentimiento.',
                'RRHH solo ve el número total de participantes y las propuestas agregadas, nunca quién hay detrás.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-white rounded-xl border border-teal-100 px-4 py-3">
                  <span className="text-teal-500 font-bold mt-0.5 shrink-0">→</span>
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── El proceso en resumen ───────────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">El proceso en resumen</h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            Cuatro fases que avanzan automáticamente, desde que un empleado da el primer paso hasta que los representantes elegidos se sientan a dialogar con la dirección.
          </p>
          <div className="relative">
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-100" />
            <div className="space-y-5">
              {FASES.map(f => (
                <div key={f.num} className="flex items-start gap-5 relative">
                  <div className={`w-12 h-12 rounded-full ${f.color} text-white font-bold text-lg flex items-center justify-center shrink-0 z-10 shadow-sm`}>{f.num}</div>
                  <div className="pt-2.5">
                    <p className={`font-bold ${f.titleColor}`}>{f.label}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Vista previa ────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Vista previa real</h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-6">Así se ven los dashboards en cada fase. Usa los botones para cambiar de vista y de fase.</p>
          <DashboardCarousel />
        </section>

        {/* ── Fase 1 ──────────────────────────────────────────────────────── */}
        {(() => {
          const f = FASES[0];
          return (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full ${f.color} text-white font-bold flex items-center justify-center shrink-0`}>1</div>
                <h2 className="text-2xl font-bold text-gray-900">{f.title}</h2>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Todo empieza cuando un empleado decide iniciar el proceso. Introduce los datos básicos de la empresa y los emails de los primeros compañeros a invitar. <strong className="text-gray-700">La empresa no sabrá quién lo ha iniciado.</strong>
              </p>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-4">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><span>👤</span> Lo que hace el empleado</h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Rellena un formulario con el nombre de la empresa, sector, número de empleados y el email de RRHH.</span></li>
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Añade los emails de los primeros compañeros. A cada uno le llega un enlace personal para unirse.</span></li>
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Puede compartir el enlace de invitación desde su dashboard para aumentar la participación.</span></li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-4">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><span>🏢</span> Lo que ve RRHH</h3>
                <p className="text-gray-500 text-sm">Recibe un email informando de que se ha iniciado un proceso. <strong className="text-gray-600">No se indica quién lo ha iniciado.</strong> Tiene acceso a un panel de solo lectura con el número de empleados unidos.</p>
              </div>
              <div className={`${f.noteLight} border rounded-xl p-4 text-sm`}>
                <span className="font-bold">⚖️ Umbral legal:</span> El proceso avanza a Fase 2 cuando se alcanza el <strong>10% de la plantilla</strong>, garantizando representatividad suficiente según el Estatuto de los Trabajadores.
              </div>
            </section>
          );
        })()}

        {/* ── Fase 2 ──────────────────────────────────────────────────────── */}
        {(() => {
          const f = FASES[1];
          return (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full ${f.color} text-white font-bold flex items-center justify-center shrink-0`}>2</div>
                <h2 className="text-2xl font-bold text-gray-900">{f.title}</h2>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Al alcanzar el umbral, todos los participantes reciben una notificación. Durante <strong className="text-gray-700">2 semanas</strong>, cada empleado puede enviar hasta 6 propuestas y votar las de sus compañeros.
              </p>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-4">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><span>👤</span> Lo que hace el empleado</h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Envía hasta <strong className="text-gray-600">6 ideas, quejas, consultas o sugerencias</strong>, anónimas o con nombre según prefiera.</span></li>
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Vota las propuestas del resto. Las más votadas serán las prioritarias en el diálogo con la empresa.</span></li>
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Al pulsar <strong className="text-gray-600">"Ya no tengo más ideas"</strong>, si todos lo confirman la fase termina antes de las 2 semanas.</span></li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-4">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><span>🏢</span> Lo que ve RRHH</h3>
                <p className="text-gray-500 text-sm">Puede ver el avance general con una nota de que las propuestas están en curso. <strong className="text-gray-600">No puede ver las propuestas ni los votos</strong> hasta que la fase haya terminado.</p>
              </div>
              <div className={`${f.noteLight} border rounded-xl p-4 text-sm`}>
                <span className="font-bold">⏱ Duración:</span> La Fase 2 dura un máximo de <strong>14 días</strong>. El contador es visible en el dashboard de cada empleado.
              </div>
            </section>
          );
        })()}

        {/* ── Fase 3 ──────────────────────────────────────────────────────── */}
        {(() => {
          const f = FASES[2];
          return (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full ${f.color} text-white font-bold flex items-center justify-center shrink-0`}>3</div>
                <h2 className="text-2xl font-bold text-gray-900">{f.title}</h2>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Se eligen los representantes que llevarán las propuestas a la dirección. El número está fijado por el <strong className="text-gray-700">Estatuto de los Trabajadores</strong> según el tamaño de la empresa.
              </p>
              <div className={`${f.light} border rounded-xl p-5 mb-6`}>
                <p className={`text-sm font-bold ${f.text} mb-3`}>📊 Representantes según la ley española</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  {[['6–30 empleados','1 representante'],['31–49 empleados','3 representantes'],['50–100 empleados','5 representantes'],['101–250 empleados','9 representantes'],['251–500 empleados','13 representantes'],['751–1.000 empleados','21 representantes']].map(([size, reps]) => (
                    <div key={size} className="bg-white rounded-lg border border-cyan-100 px-3 py-2">
                      <p className="text-gray-400 text-xs">{size}</p>
                      <p className={`font-semibold ${f.text} text-xs mt-0.5`}>{reps}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-4">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><span>👤</span> Lo que hace el empleado</h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Puede presentarse como voluntario pulsando <strong className="text-gray-600">"Quiero ser Representante"</strong>.</span></li>
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Si hay más voluntarios que puestos, se vota entre todos los participantes para elegir a los definitivos.</span></li>
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Si hay pocos voluntarios, la plataforma realiza un <strong className="text-gray-600">sorteo aleatorio</strong>. Los seleccionados pueden aceptar o rechazar.</span></li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><span>🏢</span> Lo que ve RRHH</h3>
                <p className="text-gray-500 text-sm">Ve que la empresa está en proceso de elección y cuántos voluntarios hay. <strong className="text-gray-600">No puede ver quiénes son</strong> hasta que la fase concluya.</p>
              </div>
            </section>
          );
        })()}

        {/* ── Fase 4 ──────────────────────────────────────────────────────── */}
        {(() => {
          const f = FASES[3];
          return (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full ${f.color} text-white font-bold flex items-center justify-center shrink-0`}>4</div>
                <h2 className="text-2xl font-bold text-gray-900">{f.title}</h2>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Los representantes elegidos se reúnen con la dirección con las propuestas más votadas. <strong className="text-gray-700">Un diálogo estructurado, transparente y con base legal.</strong>
              </p>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-4">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><span>👤</span> Lo que hacen los representantes</h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Presentan las propuestas más votadas a la dirección, en orden de prioridad.</span></li>
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Negocian acuerdos concretos: salarios, flexibilidad horaria, condiciones de trabajo, seguridad, etc.</span></li>
                  <li className="flex gap-3"><span className={`${f.arrow} font-bold mt-0.5`}>→</span><span>Los acuerdos quedan registrados para que todos los participantes puedan consultarlos.</span></li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><span>🏢</span> El rol de RRHH</h3>
                <p className="text-gray-500 text-sm">Reciben el listado de propuestas priorizadas y participan en las reuniones. Es la primera fase de comunicación directa y oficial entre ambas partes.</p>
              </div>
            </section>
          );
        })()}

        {/* ── Acceso ──────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cómo acceder al proceso</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
              <p className="text-2xl mb-3">👤</p>
              <h3 className="font-bold text-gray-900 mb-3">Para empleados</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">Accedes mediante un <strong className="text-gray-700">enlace mágico</strong> enviado a tu email. Sin contraseñas, sin apps. Un enlace personal e intransferible y entras directamente a tu dashboard.</p>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                <p className="text-xs text-teal-700">🔒 Tu nombre, si lo facilitas, solo se usa si decides firmar alguna propuesta. No es visible para la empresa.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
              <p className="text-2xl mb-3">🏢</p>
              <h3 className="font-bold text-gray-900 mb-3">Para RRHH</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">RRHH recibe un enlace directo a su panel de seguimiento. Panel de <strong className="text-gray-700">solo lectura</strong> que muestra el estado del proceso sin revelar identidades.</p>
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                <p className="text-xs text-sky-700">📋 RRHH puede publicar comunicados en el tablón del proceso, visibles para todos los participantes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              { q: '¿Es legal iniciar este proceso sin permiso de la empresa?', a: 'Sí. El derecho a la representación colectiva está reconocido en el Estatuto de los Trabajadores (arts. 62-76). Los trabajadores tienen derecho a elegir delegados sin autorización empresarial. La Cabina Colectiva notifica automáticamente a la empresa del inicio.' },
              { q: '¿Puede la empresa bloquear o cancelar el proceso?', a: 'No. La empresa puede participar, pero no puede impedir el ejercicio de este derecho. Intentar obstaculizarlo es una práctica antisindical, sancionable por la Inspección de Trabajo.' },
              { q: '¿Qué pasa si no hay suficientes empleados que se unan?', a: 'El proceso permanece en Fase 1 hasta alcanzar el umbral del 10%. El iniciador puede seguir invitando compañeros desde su dashboard en cualquier momento.' },
              { q: '¿La empresa puede ver quién ha votado qué propuesta?', a: 'No. Los votos son completamente anónimos. La empresa solo verá las propuestas ordenadas por número de votos, sin saber quién votó qué.' },
              { q: '¿Necesito instalar alguna aplicación?', a: 'No. Todo funciona desde el navegador, en cualquier dispositivo. Acceso mediante enlace mágico: sin contraseñas, sin apps, sin registros.' },
              { q: '¿Cuánto cuesta?', a: 'La plataforma está en fase de investigación y es gratuita. El acceso a la representación colectiva no debería depender de la capacidad económica de los empleados.' },
            ].map(({ q, a }) => (
              <details key={q} className="group border border-gray-100 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4 text-sm">{q}</span>
                  <span className="text-gray-300 group-open:rotate-180 transition-transform shrink-0 text-xl">↓</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">¿Listo para empezar?</h2>
            <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">Gratis, confidencial y respaldado por la ley.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/iniciar" className="bg-white text-teal-700 font-bold px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors text-lg">Iniciar un proceso</Link>
              <Link href="/login" className="border-2 border-white/60 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg">Acceder a mi proceso</Link>
            </div>
          </div>
        </section>

      </div>

      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-400">
          <p>© 2026 La Cabina Colectiva · La representación colectiva es un derecho.</p>
        </div>
      </footer>
    </div>
  );
}
