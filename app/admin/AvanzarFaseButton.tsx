'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  procesoId: string;
  faseActual: number;
  empresaNombre: string;
}

const faseLabelMap: Record<number, string> = {
  1: 'Fase 1 — Invitaciones',
  2: 'Fase 2 — Propuestas',
  3: 'Fase 3 — Representantes',
  4: 'Fase 4 — Diálogo',
};

export default function AvanzarFaseButton({ procesoId, faseActual, empresaNombre }: Props) {
  const [loading, setLoading] = useState(false);
  const [confirmando, setConfirmando] = useState<'avanzar' | 'retroceder' | null>(null);
  const router = useRouter();

  async function handleCambioFase(direccion: 'avanzar' | 'retroceder') {
    setLoading(true);
    setConfirmando(null);
    const endpoint = direccion === 'avanzar'
      ? `/api/admin/procesos/${procesoId}/avanzar-fase`
      : `/api/admin/procesos/${procesoId}/retroceder-fase`;
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch {
      alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (confirmando) {
    const esAvanzar = confirmando === 'avanzar';
    const faseDestino = esAvanzar ? faseActual + 1 : faseActual - 1;
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-red-700 font-semibold text-center">
          ¿{esAvanzar ? 'Avanzar' : 'Retroceder'} {empresaNombre} a {faseLabelMap[faseDestino]}?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleCambioFase(confirmando)}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Cambiando…' : 'Confirmar'}
          </button>
          <button
            onClick={() => setConfirmando(null)}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {faseActual > 1 && (
        <button
          onClick={() => setConfirmando('retroceder')}
          disabled={loading}
          className="flex-1 text-center px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 disabled:opacity-50 transition-colors"
        >
          ← Fase {faseActual - 1}
        </button>
      )}
      {faseActual < 4 ? (
        <button
          onClick={() => setConfirmando('avanzar')}
          disabled={loading}
          className="flex-1 text-center px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          Fase {faseActual + 1} →
        </button>
      ) : (
        <span className="flex-1 text-center px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm">
          Fase final
        </span>
      )}
    </div>
  );
}
