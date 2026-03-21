import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">La Cabina Colectiva</h1>
            </div>
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
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
            Iniciá un proceso de representación colectiva en tu empresa. Anónimo, seguro y respaldado por GDPR.
          </p>
          <Link
            href="/iniciar"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-lg"
          >
            Iniciar Proceso
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-16 text-center">Cómo funciona</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Phase 1 */}
            <div className="bg-white p-8 rounded-xl border-2 border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Invitaciones</h4>
              <p className="text-gray-600">
                El primer empleado inicia el proceso e invita a colegas a través de correo anónimo.
              </p>
            </div>

            {/* Phase 2 */}
            <div className="bg-white p-8 rounded-xl border-2 border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Propuestas</h4>
              <p className="text-gray-600">
                Los empleados envían propuestas, quejas y consultas. Votan y el sistema genera un reporte PDF.
              </p>
            </div>

            {/* Phase 3 */}
            <div className="bg-white p-8 rounded-xl border-2 border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Representantes</h4>
              <p className="text-gray-600">
                Se seleccionan representantes por voluntariado o sorteo para llevar las propuestas.
              </p>
            </div>

            {/* Phase 4 */}
            <div className="bg-white p-8 rounded-xl border-2 border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Diálogo</h4>
              <p className="text-gray-600">
                Los representantes dialogan con la dirección de la empresa sobre las propuestas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-16 text-center">Privacidad y Seguridad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                🔐
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Completamente Anónimo</h4>
              <p className="text-gray-600">
                Los correos se hashean y nunca se guardan en texto plano. Nadie sabe quién inició el proceso.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                ⚖️
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Cumplimiento GDPR</h4>
              <p className="text-gray-600">
                Totalmente conforme con GDPR. Los datos se encriptan y se eliminan tras completar el proceso.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                📋
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Marco Legal</h4>
              <p className="text-gray-600">
                Respaldado por las leyes de representación colectiva. Todo es documentado y verificable.
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
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-gray-900">La Cabina Colectiva</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-indigo-600">Privacidad</a>
              <a href="#" className="hover:text-indigo-600">Términos</a>
              <a href="#" className="hover:text-indigo-600">Contacto</a>
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
