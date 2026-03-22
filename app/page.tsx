import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

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
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">La Cabina Colectiva</h1>
            </div>
            <Link href="/login" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm">
              Accede a tu proceso
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight max-w-3xl mx-auto">
            Inicia un proceso de representación colectiva en tu empresa.
          </h2>
          <p className="text-xl text-gray-500 mb-10">Anónimo, seguro y respaldado por la ley.</p>
          <Link href="/iniciar" className="inline-block bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-lg">
            Iniciar Proceso
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">Cómo funciona</h3>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">Un proceso estructurado en cuatro fases que garantiza la representación legítima y anónima de todos los empleados.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { n: 1, title: 'Invitaciones', text: 'Un empleado inicia el proceso de forma anónima. La plataforma envía invitaciones a sus compañeros sin revelar quién las originó. RRHH es notificado y puede sumar más contactos.' },
              { n: 2, title: 'Propuestas', text: 'Al alcanzar el umbral de participación, los empleados envían propuestas y quejas — anónimas o firmadas — y votan las más importantes. La IA genera un informe PDF con los resultados.' },
              { n: 3, title: 'Representantes', text: 'Los empleados pueden presentarse como candidatos. Si hay suficientes, se vota; si no, se sortea. Los designados aceptan o rechazan hasta completar el número legal.' },
              { n: 4, title: 'Diálogo', text: 'Los representantes inician un diálogo formal con la dirección. La plataforma facilita la comunicación y ofrece guías para que las reuniones sean productivas y lleguen a acuerdos concretos.' },
            ].map(({ n, title, text }) => (
              <div key={n} className="bg-white p-8 rounded-xl border-2 border-teal-200">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">{n}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{title}</h4>
                <p className="text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">En números</h3>
          <p className="text-gray-600 text-center mb-16">Procesos reales iniciados por empleados como tú.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-teal-50 rounded-2xl p-10 border border-teal-100">
              <p className="text-7xl font-black text-teal-600 mb-3">{stats.totalProcesos}</p>
              <p className="text-lg font-semibold text-gray-800">Procesos iniciados</p>
              <p className="text-sm text-gray-500 mt-1">Empresas que han dado el paso</p>
            </div>
            <div className="text-center bg-teal-50 rounded-2xl p-10 border border-teal-100">
              <p className="text-7xl font-black text-teal-600 mb-3">{stats.totalParticipantes}</p>
              <p className="text-lg font-semibold text-gray-800">Empleados participantes</p>
              <p className="text-sm text-gray-500 mt-1">Trabajadores que han ejercido su derecho</p>
            </div>
            <div className="text-center bg-teal-50 rounded-2xl p-10 border border-teal-100">
              <p className="text-7xl font-black text-teal-600 mb-3">{stats.avgParticipacion}%</p>
              <p className="text-lg font-semibold text-gray-800">Participación media</p>
              <p className="text-sm text-gray-500 mt-1">Empleados que se unen de media por proceso</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">Preguntas frecuentes</h3>
          <p className="text-gray-600 text-center mb-16">Todo lo que necesitas saber antes de empezar.</p>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Es realmente anónimo?</h4>
              <p className="text-gray-600 mb-3">Hay dos niveles de privacidad según el momento del proceso:</p>
              <div className="space-y-3 mb-4">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <p className="text-sm text-teal-900"><span className="font-semibold">Fase de invitaciones:</span> Los correos se convierten en un código irreversible (hash SHA-256) y <strong>nunca se guardan en texto plano</strong>. Ni la empresa ni los administradores saben quién está en la lista.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900"><span className="font-semibold">Al acceder al proceso:</span> Cuando un empleado introduce su correo para entrar, ese correo se guarda de forma cifrada para poder enviarle notificaciones del proceso. <strong>Nadie en la empresa puede acceder a esa información</strong> — solo se usa internamente para comunicaciones del sistema.</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">En ningún caso la empresa sabe quién inició el proceso, quién votó qué, ni puede identificar a los participantes.</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Ejemplo real de transformación</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm font-mono">
                  <span className="bg-white border border-gray-200 rounded px-3 py-1.5 text-gray-800 break-all">maria@empresa.com</span>
                  <span className="text-gray-400 font-sans font-bold text-lg sm:text-xl">→</span>
                  <span className="bg-white border border-gray-200 rounded px-3 py-1.5 text-teal-700 break-all text-xs">3f4a7c2e8b1d9a0f...</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">El proceso de transformación es irreversible: a partir del código no es posible recuperar el email original.</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Puede mi empresa tomar represalias por participar?</h4>
              <p className="text-gray-600">El derecho a la representación colectiva está protegido por el Estatuto de los Trabajadores. La empresa no puede identificar a quién inició el proceso ni a quién ha participado, ya que el sistema no guarda ningún dato personal identificable.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Cuántos empleados necesito para que el proceso sea válido?</h4>
              <p className="text-gray-600">La ley exige representación a partir de 6 empleados. El número exacto de representantes varía según el tamaño de la plantilla: 1 delegado de personal entre 6 y 30 empleados, 3 entre 31 y 49, y comité de empresa a partir de 50. La plataforma calcula automáticamente el umbral necesario.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Qué pasa si RRHH no colabora?</h4>
              <p className="text-gray-600">No es necesaria su colaboración para iniciar el proceso. RRHH es notificado del inicio y puede facilitar el acceso a más compañeros, pero el proceso avanza igualmente si los empleados alcanzan el umbral por sus propios medios.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Qué pasa con mis datos al finalizar el proceso?</h4>
              <p className="text-gray-600">Toda la información vinculada al proceso se elimina de los servidores una vez completado. La plataforma cumple con el RGPD (GDPR) y aplica el principio de minimización de datos desde el diseño.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Necesito instalar algo o crear una cuenta?</h4>
              <p className="text-gray-600">No. Todo funciona desde el navegador. El acceso es mediante enlace mágico enviado por email — sin contraseñas, sin apps, sin registros. Recibes un enlace y entras directamente a tu espacio.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Puedo participar aunque no haya sido yo quien inició el proceso?</h4>
              <p className="text-gray-600">Sí. El empleado que inicia el proceso invita a sus compañeros y también puede reenviar invitaciones. Si recibes un enlace de invitación, puedes unirte con un solo clic sin necesidad de haber iniciado nada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-16 text-center">Privacidad y Seguridad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: '🔐', title: 'Completamente Anónimo', text: 'Los correos se hashean y nunca se guardan en texto plano. Nadie sabe quién inició el proceso.' },
              { icon: '⚖️', title: 'Cumplimiento GDPR', text: 'Totalmente conforme con GDPR. Los datos se encriptan y se eliminan tras completar el proceso.' },
              { icon: '📋', title: 'Marco Legal', text: 'Respaldado por el Estatuto de los Trabajadores. Todo el proceso es documentado y verificable.' },
            ].map(({ icon, title, text }) => (
              <div key={title}>
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-2xl mb-4">{icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{title}</h4>
                <p className="text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-gray-900">La Cabina Colectiva</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-teal-600">Privacidad</a>
              <a href="#" className="hover:text-teal-600">Términos</a>
              <a href="#" className="hover:text-teal-600">Contacto</a>
            </div>
            <div className="text-sm text-gray-600">© 2026 La Cabina Colectiva</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
