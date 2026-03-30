import { LogoLink } from '@/components/Logo'
import Link from 'next/link'

export const metadata = {
  title: 'Términos y Condiciones — La Cabina Colectiva',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <LogoLink />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: marzo de 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Objeto</h2>
            <p>
              Estos Términos y Condiciones regulan el uso de La Cabina Colectiva (en adelante, &quot;la plataforma&quot;), un servicio digital que facilita la creación de procesos de representación colectiva de trabajadores en empresas españolas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Aceptación</h2>
            <p>
              El acceso y uso de la plataforma implica la aceptación de estos términos. Si no estás de acuerdo, debes abandonar la plataforma y no utilizar sus servicios.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Descripción del servicio</h2>
            <p>
              La Cabina Colectiva permite a los empleados de una empresa iniciar y gestionar un proceso estructurado para constituir una representación colectiva de trabajadores. El servicio incluye:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Herramientas para invitar a compañeros a participar de forma confidencial.</li>
              <li>Un espacio para recoger propuestas, quejas y sugerencias.</li>
              <li>Un sistema de votación para elegir representantes.</li>
              <li>Un canal de comunicación entre los representantes y la dirección de la empresa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Uso permitido</h2>
            <p>El usuario se compromete a:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Usar la plataforma únicamente para fines legítimos relacionados con la representación laboral.</li>
              <li>No proporcionar información falsa al registrarse o durante el proceso.</li>
              <li>No intentar acceder a datos de otros usuarios o procesos.</li>
              <li>No usar la plataforma para acosar, intimidar o perjudicar a otros participantes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Confidencialidad</h2>
            <p>
              La plataforma está diseñada para proteger la identidad de los participantes frente a la empresa. Sin embargo, La Cabina Colectiva no puede garantizar la confidencialidad absoluta en casos de requerimiento judicial o legal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Limitación de responsabilidad</h2>
            <p>
              La Cabina Colectiva proporciona una herramienta de facilitación y no actúa como asesor legal o laboral. El resultado del proceso depende exclusivamente de la participación de los empleados y de la voluntad de la empresa. No nos responsabilizamos de las consecuencias laborales derivadas del uso de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Disponibilidad del servicio</h2>
            <p>
              Nos esforzamos por mantener la plataforma operativa, pero no garantizamos una disponibilidad ininterrumpida. Podemos suspender el servicio temporalmente por mantenimiento o causas técnicas sin previo aviso.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Modificaciones</h2>
            <p>
              Podemos actualizar estos términos en cualquier momento. Los cambios relevantes se comunicarán a los usuarios activos por email. El uso continuado de la plataforma tras la publicación de cambios implica su aceptación.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Ley aplicable</h2>
            <p>
              Estos términos se rigen por la legislación española. Cualquier disputa se someterá a los juzgados y tribunales competentes de España.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Contacto</h2>
            <p>
              Para cualquier consulta sobre estos términos, escríbenos a{' '}
              <a href="mailto:hola@lacabinacolectiva.es" className="text-teal-600 hover:underline">hola@lacabinacolectiva.es</a>.
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
