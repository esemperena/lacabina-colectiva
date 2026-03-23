'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function InvitarPage() {
  const params = useParams();
  const procesoId = params.procesoId as string;

  const [empresaNombre, setEmpresaNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch empresa name from proceso
    fetch(`/api/procesos?id=${procesoId}`)
      .then(r => r.json())
      .then(data => {
        if (data?.empresa?.nombre) setEmpresaNombre(data.empresa.nombre);
      })
      .catch(() => {});
  }, [procesoId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/invitar/${procesoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnviado(true);
      } else {
        setError(data.error || 'Error al procesar la solicitud.');
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 w-fit">
            <Image src="/logo-icon.svg" alt="La Cabina Colectiva" width={40} height={40} className="sm:hidden" />
            <Image src="/logo-full.svg" alt="La Cabina Colectiva" width={260} height={40} className="hidden sm:block" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full shadow-sm">
          {enviado ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✉️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Revisa tu correo!</h2>
              <p className="text-gray-600">
                Si tu email es válido, recibirás en breve un enlace personal para unirte al proceso.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Te han invitado</h2>
                {empresaNombre && (
                  <p className="text-gray-600">
                    Un compañero de <strong>{empresaNombre}</strong> quiere que te unas al proceso de representación colectiva.
                  </p>
                )}
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-teal-800 leading-relaxed">
                  🔒 <strong>Completamente anónimo.</strong> Tu empresa no sabrá que te has unido. Tu correo nunca se guarda en texto claro.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tu correo corporativo
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@empresa.com"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {loading ? 'Enviando…' : 'Solicitar mi enlace de invitación'}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                Recibirás un enlace personal en tu correo para acceder al proceso.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
