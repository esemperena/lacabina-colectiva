import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { LogoLink } from "@/components/Logo";
import ContactoForm from "@/components/ContactoForm";

// Siempre datos frescos de la base de datos (sin caché)
export const revalidate = 0;

async function getStats() {
  try {
    const [procesosRes, participantesRes] = await Promise.all([
      supabaseAdmin.from('procesos').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('participantes').select('id', { count: 'exact', head: true }),
    ]);
    const totalProcesos = procesosRes.count ?? 0;
    const totalParticipantes = participantesRes.count ?? 0;
    const { data: procesosData } = await supabaseAdmin
      .from('procesos').select('empleados_unidos, empleados_objetivo').gt('empleados_objetivo', 0);
    let avgParticipacion = 0;
    if (procesosData && procesosData.length > 0) {
      const total = procesosData.reduce((acc, p) => acc + (p.empleados_unidos / p.empleados_objetivo) * 100, 0);
      avgParticipacion = Math.round(total / procesosData.length);
    }
    return { totalProcesos, totalParticipantes, avgParticipacion };
  } catch {
    return { totalProcesos: 0, totalParticipantes: 0, avgParticipacion: 0 };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo: icono en móvil, completo en escritorio */}
            <LogoLink />
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link href="/como-funciona" className="text-sm font-semibold text-gray-600 hover:text-teal-600 transition-colors hidden sm:block">
                Cómo funciona
              </Link>
              <Link href="/contacto" className="text-sm font-semibold text-gray-600 hover:text-teal-600 transition-colors hidden sm:block">
                Contacto
              </Link>
              <Link href="/login" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 sm:px-5 py-2 rounded-lg transition-colors text-sm">
                Accede a tu proceso
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero — gradient background with pattern */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0D9488 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        {/* Decorative blobs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              Respaldado por el Estatuto de los Trabajadores
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Inicia un proceso de
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600"> representación colectiva</span>
              {' '}en tu empresa
            </h2>
            <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Crea un comité de representación de los trabajadores de forma ordenada y confidencial. Un canal oficial donde empleados y empresa se escuchan, alinean expectativas y avanzan juntos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/iniciar" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-all text-lg shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5">
                Iniciar Proceso
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link href="/como-funciona" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all text-lg border border-gray-200">
                Ver cómo funciona
              </Link>
            </div>
          </div>

          {/* Trust signals */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Datos confidenciales
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              RGPD compliant
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Sin contraseñas
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wide mb-3">El proceso</p>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Cuatro fases, un objetivo</h3>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Constituir un comité de representación legítimo y reconocido legalmente — y de paso abrir un canal real de comunicación entre el equipo y la dirección.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: 1, title: 'Invitaciones', text: 'Un empleado inicia el proceso de forma confidencial. La plataforma envía invitaciones sin revelar quién las originó. RRHH es notificado y puede sumar más contactos.', color: 'from-emerald-500 to-emerald-600', icon: '📨' },
              { n: 2, title: 'Propuestas', text: 'Los empleados comparten sus inquietudes, ideas y necesidades de forma ordenada. Las más valoradas por el equipo suben a lo más alto de la lista.', color: 'from-teal-500 to-teal-600', icon: '💡' },
              { n: 3, title: 'Representantes', text: 'El equipo elige a las personas que mejor los representan para trasladar su voz. Si hay suficientes voluntarios, se vota; si no, se sortea.', color: 'from-cyan-600 to-cyan-700', icon: '🗳️' },
              { n: 4, title: 'Comunicación', text: 'Los representantes presentan las prioridades del equipo a la dirección. Un canal formal donde ambos lados se escuchan y avanzan juntos.', color: 'from-sky-600 to-sky-700', icon: '🤝' },
            ].map(({ n, title, text, color, icon }) => (
              <div key={n} className="group relative bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 transition-all duration-300">
                {/* Phase number badge */}
                <div className={`w-10 h-10 bg-gradient-to-br ${color} text-white rounded-xl flex items-center justify-center font-bold text-sm mb-5 shadow-md`}>
                  {n}
                </div>
                <div className="text-2xl mb-3">{icon}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
                {/* Connector line (not on last) */}
                {n < 4 && (
                  <div className="hidden lg:block absolute top-12 -right-3 w-6 border-t-2 border-dashed border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wide mb-3">Datos reales</p>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">En números</h3>
            <p className="text-gray-500 text-lg">Procesos reales iniciados por empleados como tú.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: stats.totalProcesos, label: 'Procesos iniciados', sub: 'Empresas que han dado el paso', gradient: 'from-emerald-500 to-emerald-600' },
              { value: stats.totalParticipantes, label: 'Empleados participantes', sub: 'Trabajadores que han ejercido su derecho', gradient: 'from-teal-500 to-teal-600' },
              { value: `${stats.avgParticipacion}%`, label: 'Participación media', sub: 'Empleados que se unen de media por proceso', gradient: 'from-cyan-600 to-sky-600' },
            ].map(({ value, label, sub, gradient }) => (
              <div key={label} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
                <p className="text-5xl sm:text-6xl font-black text-gray-900 mb-2">{value}</p>
                <p className="text-base font-semibold text-gray-700">{label}</p>
                <p className="text-sm text-gray-400 mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy highlights */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wide mb-3">Seguridad</p>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Privacidad por diseño</h3>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Tu identidad está protegida en cada paso del proceso.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔐', title: 'Confidencial', text: 'La empresa no puede saber quién ha iniciado el proceso ni quién participa. Tu nombre y tus datos nunca se comparten con tu empresa sin tu consentimiento.' },
              { icon: '⚖️', title: 'Cumplimiento RGPD', text: 'Totalmente conforme con RGPD. Los datos se cifran en tránsito y reposo, y se eliminan tras completar el proceso.' },
              { icon: '📋', title: 'Marco Legal', text: 'Respaldado por el Estatuto de los Trabajadores (arts. 62-66). Todo el proceso es documentado y verificable.' },
            ].map(({ icon, title, text }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-8 hover:bg-teal-50 transition-colors">
                <div className="text-3xl mb-4">{icon}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* What the company sees */}
          <div className="mt-12 max-w-xl mx-auto bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4 text-center">Lo que ve la empresa</p>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700">Número total de participantes</span>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700">Propuestas y votos agregados</span>
              </div>
              <div className="flex items-center gap-3 bg-white border border-red-100 rounded-lg px-4 py-3">
                <span className="text-red-400">✗</span>
                <span className="text-gray-500">Quién inició el proceso</span>
              </div>
              <div className="flex items-center gap-3 bg-white border border-red-100 rounded-lg px-4 py-3">
                <span className="text-red-400">✗</span>
                <span className="text-gray-500">Quién participa o ha votado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wide mb-3">FAQ</p>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h3>
            <p className="text-gray-500 text-lg">Todo lo que necesitas saber antes de empezar.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: '¿Mi empresa sabrá que participo?', a: 'No. La empresa no tiene acceso a los nombres ni a los datos de quién ha participado. Solo ve el número total de participantes y las propuestas agregadas. Tu nombre se guarda en la plataforma para gestionar el proceso, pero nunca se comparte con tu empresa sin tu consentimiento explícito.' },
              { q: '¿Puede mi empresa tomar represalias?', a: 'El derecho a la representación colectiva está protegido por el Estatuto de los Trabajadores. La empresa no puede identificar a quién inició el proceso ni a quién ha participado.' },
              { q: '¿Qué es exactamente un comité de representación?', a: 'Es el órgano legal que representa a los empleados ante la empresa. Puede ser un delegado de personal (6-30 empleados) o un comité de empresa (más de 50). Sus miembros son elegidos por los propios trabajadores y tienen el derecho legal de trasladar las inquietudes del equipo a la dirección.' },
              { q: '¿Cuántos empleados se necesitan?', a: 'La ley exige representación a partir de 6 empleados. El número de representantes varía según el tamaño de la plantilla. La plataforma calcula automáticamente el umbral necesario.' },
              { q: '¿Qué pasa si RRHH no colabora?', a: 'No es necesaria su colaboración. RRHH es notificado y puede facilitar el acceso, pero el proceso avanza igualmente si los empleados alcanzan el umbral por sus propios medios.' },
              { q: '¿Necesito instalar algo?', a: 'No. Todo funciona desde el navegador. El acceso es mediante enlace mágico enviado por email — sin contraseñas, sin apps, sin registros.' },
              { q: '¿Qué pasa con mis datos al finalizar?', a: 'Toda la información vinculada al proceso se elimina de los servidores una vez completado. Cumplimos con RGPD y aplicamos el principio de minimización de datos desde el diseño.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h4 className="text-base font-bold text-gray-900 mb-2">{q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">¿Tienes alguna pregunta?</h3>
            <p className="text-gray-500">Escríbenos y te respondemos lo antes posible.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <ContactoForm compact />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-teal-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Da el primer paso</h3>
          <p className="text-teal-100 text-lg mb-10 max-w-xl mx-auto">La voz de tu equipo, de forma ordenada y con base legal. Tus datos son confidenciales desde el primer momento.</p>
          <Link href="/iniciar" className="inline-flex items-center gap-2 bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition-all text-lg shadow-xl hover:-translate-y-0.5">
            Iniciar Proceso
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <LogoLink />
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-teal-600 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-teal-600 transition-colors">Términos</a>
              <Link href="/contacto" className="hover:text-teal-600 transition-colors">Contacto</Link>
            </div>
            <div className="text-sm text-gray-400">&copy; 2026 La Cabina Colectiva</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
