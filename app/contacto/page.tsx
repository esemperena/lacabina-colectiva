import Link from 'next/link';
import { LogoLink } from '@/components/Logo';
import ContactoForm from '@/components/ContactoForm';

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <LogoLink />
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link href="/como-funciona" className="text-sm font-semibold text-gray-600 hover:text-teal-600 transition-colors hidden sm:block">
                Cómo funciona
              </Link>
              <Link href="/contacto" className="text-sm font-semibold text-teal-600 hidden sm:block">
                Contacto
              </Link>
              <Link href="/login" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 sm:px-5 py-2 rounded-lg transition-colors text-sm">
                Accede a tu proceso
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Contacto</h1>
          <p className="text-gray-500 text-lg">
            ¿Tienes dudas o quieres saber más? Escríbenos y te respondemos lo antes posible.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <ContactoForm />
        </div>

        <div className="mt-8 flex gap-6 text-sm text-gray-500">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Email directo</p>
            <a href="mailto:hola@lacabinacolectiva.es" className="text-teal-600 hover:underline">
              hola@lacabinacolectiva.es
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
