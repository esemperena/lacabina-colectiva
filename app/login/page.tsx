'use client';

import { useState } from 'react';
import Link from 'next/link';

type TipoLogin = 'empleado' | 'rrhh';

export default function LoginPage() {
  const [tipo, setTipo] = useState<TipoLogin>('empleado');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tipo }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al enviar el enlace');
      } else {
        setSent(true);
      }
    } catch (err) {
      setError('Error al enviar el enlace. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Enlace enviado</h2>
          <p className="text-gray-600 mb-6">
            Te hemos enviado un enlace de acceso a <strong>{email}</strong>. Revisa tu bandeja de entrada (y también la carpeta de spam).
          </p>
          <p className="text-sm text-gray-500 mb-8">
            El enlace es válido durante 7 días.
          </p>
          <button
            onClick={() => {
              setSent(false);
              setEmail('');
              setError('');
            }}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Enviar otro enlace
          </button>
          <p className="text-sm text-gray-600 mt-6">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 max-w-md w-full">
        <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-70">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">La Cabina Colectiva</h1>
        </Link>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceder a mi proceso</h2>
        <p className="text-gray-600 mb-8">
          Te enviaremos un enlace de acceso a tu correo
        </p>

        {/* Tipo Toggle */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setTipo('empleado')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
              tipo === 'empleado'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Soy empleado
          </button>
          <button
            onClick={() => setTipo('rrhh')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
              tipo === 'rrhh'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Soy RRHH
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Tu correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Enviando...' : 'Enviar enlace de acceso'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          ¿Eres nuevo? {' '}
          <Link href="/iniciar" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Inicia un proceso
          </Link>
        </p>
      </div>
    </div>
  );
}
