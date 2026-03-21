'use client';

import { useState } from 'react';

export default function ContactForm({ token, empresaNombre }: { token: string; empresaNombre: string }) {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/rrhh/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nombre, mensaje, empresaNombre }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: '✅ Tu consulta ha sido enviada. Te responderemos en menos de 48 horas.' });
        setNombre('');
        setMensaje('');
      } else {
        setResult({ ok: false, message: data.error || 'Error al enviar la consulta.' });
      }
    } catch {
      setResult({ ok: false, message: 'Error de conexión. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-2">¿Tienes alguna duda?</h3>
      <p className="text-gray-600 mb-6">
        Si tienes preguntas sobre el proceso, la plataforma o la legislación aplicable, escríbenos. Te responderemos personalmente en menos de 48 horas.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tu nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre y apellidos"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Empresa</label>
          <input
            type="text"
            value={empresaNombre}
            readOnly
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-500 bg-gray-50 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tu consulta</label>
          <textarea
            value={mensaje}
            onChange={e => setMensaje(e.target.value)}
            rows={5}
            placeholder="Escribe aquí tu pregunta o comentario…"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
          />
        </div>

        {result && (
          <div className={`p-3 rounded-lg text-sm ${result.ok ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {result.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !nombre.trim() || !mensaje.trim()}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {loading ? 'Enviando…' : 'Enviar consulta'}
        </button>
      </form>
    </div>
  );
}
