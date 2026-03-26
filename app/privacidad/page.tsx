import { LogoLink } from '@/components/Logo'
import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad — La Cabina Colectiva',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <LogoLink />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: marzo de 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Responsable del tratamiento</h2>
            <p>
              La Cabina Colectiva, contacto: <a href="mailto:hola@lacabinacolectiva.es" className="text-teal-600 hover:underline">hola@lacabinacolectiva.es</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Datos que recogemos</h2>
            <p>Recogemos únicamente los datos necesarios para prestar el servicio:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Persona que inicia el proceso:</strong> dirección de email y nombre y apellidos al completar el registro.</li>
              <li><strong>Compañeros invitados:</strong> dirección de email (transformada en un código interno), y nombre y apellidos si deciden proporcionarlos al unirse.</li>
              <li><strong>Empresa (RRHH):</strong> nombre de la empresa, sector, número de empleados y email de contacto de RRHH.</li>
              <li><strong>Uso de la web:</strong> si aceptas las cookies, recogemos datos de navegación anónimos mediante Google Analytics (páginas visitadas, tiempo de sesión, origen del tráfico).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Finalidad del tratamiento</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestionar el proceso de representación colectiva y enviar comunicaciones relacionadas con él.</li>
              <li>Mejorar la plataforma a través de datos de uso anónimos (solo si aceptas las cookies).</li>
              <li>Responder a consultas enviadas a través del formulario de contacto.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Confidencialidad</h2>
            <p>
              La empresa nunca tiene acceso a los datos personales de los participantes. Solo puede ver el número total de personas que se han unido al proceso, nunca sus nombres ni emails.
            </p>
            <p className="mt-2">
              La plataforma tampoco revela en ningún momento quién ha iniciado el proceso.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Cookies</h2>
            <p>
              Usamos cookies analíticas de Google Analytics (a través de Google Tag Manager) para entender cómo se usa la web. Estas cookies solo se activan si das tu consentimiento explícito desde el banner que aparece al visitar la web por primera vez.
            </p>
            <p className="mt-2">
              No usamos cookies publicitarias ni de seguimiento entre sitios. Puedes retirar tu consentimiento en cualquier momento borrando las cookies del navegador.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Conservación de datos</h2>
            <p>
              Los datos se conservan mientras el proceso esté activo y se eliminan una vez finalizado, salvo obligación legal de conservarlos por más tiempo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Tus derechos</h2>
            <p>
              Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición y portabilidad escribiéndonos a{' '}
              <a href="mailto:hola@lacabinacolectiva.es" className="text-teal-600 hover:underline">hola@lacabinacolectiva.es</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Base legal</h2>
            <p>
              El tratamiento de datos se basa en el consentimiento del usuario (art. 6.1.a RGPD) y en la ejecución del servicio solicitado (art. 6.1.b RGPD).
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link href="/" className="text-sm text-teal-600 hover:underline">← Volver al inicio</Link>
        </div>
      </main>
    </div>
  )
}
