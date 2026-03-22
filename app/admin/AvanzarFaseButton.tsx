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
  const [confirmando, setConfirmando] = useState(false);
  const router = useRouter();

  if (faseActual >= 4) {
    return (
      <span className="text-center px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm">
        Fase final alcanzada
      </span>
    );
  }

  async function handleAvanzar() {
    setLoading(true);
    setConfirmando(false);
    try {
      const res = await fetch(`/api/admin/procesos/${procesoId}/avanzar-fase`, {
        method: 'POST',
      });
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
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-red-700 font-semibold text-center">
          ¿Avanzar {empresaNombre} a {faseLabelMap[faseActual + 1]}?
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAvanzar}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Avanzando…' : 'Confirmar'}
          </button>
          <button
            onClick={() => setConfirmando(false)}
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
    <button
      onClick={() => setConfirmando(true)}
      className="text-center px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
    >
      Avanzar a Fase {faseActual + 1} →
    </button>
  );
}
