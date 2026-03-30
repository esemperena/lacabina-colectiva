import Link from 'next/link'
import { LogoLink } from '@/components/Logo'

export const metadata = {
  title: 'Enlace no válido — La Cabina Colectiva',
}

export default function AccesoInvalidoPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <LogoLink />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">🔗</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Este enlace no es válido
          </h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            El enlace que has usado no existe, ya fue utilizado, o ha caducado.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-amber-800 font-semibold mb-1">¿Qué puedes hacer?</p>
            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
              <li>Si tienes un email de invitación, usa el enlace que aparece en ese email.</li>
              <li>Si ya te registraste antes, accede con tu email desde la pantalla de acceso.</li>
              <li>Si crees que es un error, escríbenos.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm"
            >
              Ir a la pantalla de acceso
            </Link>
            <Link
              href="/contacto"
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
            >
              Contactar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
