import Link from "next/link";

export default function Home() {
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
            <Link
              href="/login"
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Ya tengo un proceso
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Tu voz en el trabajo,<br />de forma anónima
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Inicia un proceso de representación colectiva en tu empresa. Anónimo, seguro y respaldado por la ley.
          </p>
          <Link
            href="/iniciar"
            className="inline-block bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-lg"
          >
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
            <div className="bg-white p-8 rounded-xl border-2 border-teal-200">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Invitaciones</h4>
              <p className="text-gray-600 leading-relaxed">
                Un empleado inicia el proceso de forma anónima. La plataforma envía invitaciones a sus compañeros sin revelar quién las originó. RRHH es notificado y puede sumar más contactos.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border-2 border-teal-200">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Propuestas</h4>
              <p className="text-gray-600 leading-relaxed">
                Al alcanzar el umbral de participación, los empleados envían propuestas y quejas — anónimas o firmadas — y votan las más importantes. La IA genera un informe PDF con los resultados.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border-2 border-teal-200">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Representantes</h4>
              <p className="text-gray-600 leading-relaxed">
                Los empleados pueden presentarse como candidatos. Si hay suficientes, se vota; si no, se sortea. Los designados aceptan o rechazan hasta completar el número legal.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border-2 border-teal-200">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">4</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Diálogo</h4>
              <p className="text-gray-600 leading-relaxed">
                Los representantes inician un diálogo formal con la dirección. La plataforma facilita la comunicación y ofrece guías para que las reuniones sean productivas y lleguen a acuerdos concretos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">Preguntas frecuentes</h3>
          <p className="text-gray-600 text-center mb-16">Todo lo que necesitas saber antes de empezar.</p>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Es realmente anónimo?</h4>
              <p className="text-gray-600">Sí. Los correos electrónicos nunca se guardan en texto claro — se convierten en un código irreversible (hash SHA-256). Nadie, ni siquiera los administradores de la plataforma, puede saber quién inició el proceso o quién votó qué.</p>
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

      {/* Privacy Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-16 text-center">Privacidad y Seguridad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                🔐
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Completamente Anónimo</h4>
              <p className="text-gray-600">
                Los correos se hashean y nunca se guardan en texto plano. Nadie sabe quién inició el proceso.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                ⚖️
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Cumplimiento GDPR</h4>
              <p className="text-gray-600">
                Totalmente conforme con GDPR. Los datos se encriptan y se eliminan tras completar el proceso.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                📋
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Marco Legal</h4>
              <p className="text-gray-600">
                Respaldado por el Estatuto de los Trabajadores. Todo el proceso es documentado y verificable.
              </p>
            </div>
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
            <div className="text-sm text-gray-600">
              © 2026 La Cabina Colectiva
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
