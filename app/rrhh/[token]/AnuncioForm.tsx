'use client';

import { useState } from 'react';

interface Anuncio {
  id: string;
  contenido: string;
  created_at: string;
}

interface Props {
  token: string;
  anunciosIniciales: Anuncio[];
}

export default function AnuncioForm({ token, anunciosIniciales }: Props) {
  const [anuncios, setAnuncios] = useState<Anuncio[]>(anunciosIniciales);
  const [contenido, setContenido] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contenido.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/rrhh/anuncios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, contenido }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnuncios(prev => [data.anuncio, ...prev]);
        setContenido('');
        setResult({
          ok: true,
          message: `✅ Anuncio publicado. Se notificó a ${data.emailsEnviados} empleado${data.emailsEnviados !== 1 ? 's' : ''} por email.`,
        });
      } else {
        setResult({ ok: false, message: data.error || 'Error al publicar el anuncio.' });
      }
    } catch {
      setResult({ ok: false, message: 'Error de conexión. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Tablón de anuncios</h3>
        <p className="text-sm text-gray-500">
          Publica un mensaje o comunicado para todos los empleados del proceso. Lo verán en su dashboard y recibirán una notificación por email.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          rows={4}
          placeholder="Escribe aquí tu mensaje para los empleados..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y mb-3"
          required
        />
        {result && (
          <div className={`p-3 rounded-lg text-sm mb-3 ${result.ok ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {result.message}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !contenido.trim()}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors text-sm"
        >
          {loading ? 'Publicando…' : 'Publicar anuncio'}
        </button>
      </form>

      {/* Published announcements */}
      {anuncios.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Anuncios publicados</h4>
          <div className="space-y-3">
            {anuncios.map(a => (
              <div key={a.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap mb-2">{a.contenido}</p>
                <p className="text-xs text-gray-400">
                  {new Date(a.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
