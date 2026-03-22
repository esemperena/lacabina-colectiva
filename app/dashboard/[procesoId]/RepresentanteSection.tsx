'use client';

import { useState } from 'react';

interface Props {
  procesoId: string;
  participanteId: string;
  esVoluntario: boolean;
  voluntariosActuales: number;
  representantesNecesarios: number;
}

export default function RepresentanteSection({
  procesoId,
  participanteId,
  esVoluntario: esVoluntarioInicial,
  voluntariosActuales: voluntariosIniciales,
  representantesNecesarios,
}: Props) {
  const [esVoluntario, setEsVoluntario] = useState(esVoluntarioInicial);
  const [voluntarios, setVoluntarios] = useState(voluntariosIniciales);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const porcentaje = representantesNecesarios > 0
    ? Math.min(100, Math.round((voluntarios / representantesNecesarios) * 100))
    : 0;

  // SVG circle chart
  const radius = 40;
  const circunferencia = 2 * Math.PI * radius;
  const progreso = circunferencia - (porcentaje / 100) * circunferencia;

  async function handleVoluntario() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/procesos/${procesoId}/voluntario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participante_id: participanteId }),
      });
      if (res.ok) {
        setEsVoluntario(true);
        setVoluntarios(v => v + 1);
      } else {
        const data = await res.json();
        setError(data.error || 'Error al registrar');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-start gap-8">
      {/* Left: info + button */}
      <div className="flex-1">
        <p className="text-gray-700 mb-4">
          Hay <strong>2 semanas</strong> para que los empleados se presenten como voluntarios. Entre los voluntarios, los propios participantes votarán quiénes serán los representantes finales.
        </p>
        <p className="text-gray-700 mb-6">
          Si al final del plazo no hay suficientes voluntarios, se realizará un <strong>sorteo</strong> entre todos los participantes para completar el número necesario.
        </p>

        {!esVoluntario ? (
          <div>
            <button
              onClick={handleVoluntario}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {loading ? 'Registrando…' : '🙋 Quiero ser Representante'}
            </button>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        ) : (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-800 font-semibold text-sm">✅ Te has presentado como voluntario</p>
            <p className="text-purple-700 text-sm mt-1">Los demás participantes votarán entre los candidatos al terminar el plazo.</p>
          </div>
        )}
      </div>

      {/* Right: circular chart */}
      <div className="flex flex-col items-center gap-2 min-w-[140px]">
        <svg width="120" height="120" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="#e9d5ff"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="#9333ea"
            strokeWidth="12"
            strokeDasharray={circunferencia}
            strokeDashoffset={progreso}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          {/* Center text */}
          <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#7e22ce">{voluntarios}</text>
          <text x="50" y="62" textAnchor="middle" fontSize="10" fill="#a855f7">de {representantesNecesarios}</text>
        </svg>
        <p className="text-sm text-center text-gray-600 font-medium">Voluntarios presentados</p>
        {voluntarios >= representantesNecesarios && (
          <p className="text-xs text-green-700 font-semibold bg-green-50 px-3 py-1 rounded-full">¡Suficientes candidatos!</p>
        )}
      </div>
    </div>
  );
}
