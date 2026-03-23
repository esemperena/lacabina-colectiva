'use client';

import { useState } from 'react';

interface Candidato {
  id: string;
  nombre: string | null;
  votos_count: number;
  has_voted: boolean;
}

interface Props {
  procesoId: string;
  participanteId: string;
  esVoluntario: boolean;
  voluntariosActuales: number;
  representantesNecesarios: number;
  estadoRepresentante: string | null;
  candidatos?: Candidato[];
  representantesConfirmados?: number;
}

export default function RepresentanteSection({
  procesoId,
  participanteId,
  esVoluntario: esVoluntarioInicial,
  voluntariosActuales: voluntariosIniciales,
  representantesNecesarios,
  estadoRepresentante: estadoInicial,
  candidatos: candidatosIniciales = [],
  representantesConfirmados = 0,
}: Props) {
  const [esVoluntario, setEsVoluntario] = useState(esVoluntarioInicial);
  const [voluntarios, setVoluntarios] = useState(voluntariosIniciales);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estadoRepresentante, setEstadoRepresentante] = useState(estadoInicial);
  const [candidatos, setCandidatos] = useState(candidatosIniciales);
  const [respondiendo, setRespondiendo] = useState(false);

  const porcentaje = representantesNecesarios > 0
    ? Math.min(100, Math.round((voluntarios / representantesNecesarios) * 100))
    : 0;

  const radius = 40;
  const circunferencia = 2 * Math.PI * radius;
  const progreso = circunferencia - (porcentaje / 100) * circunferencia;

  const hayVotacion = voluntarios > representantesNecesarios;
  const confirmacionDirecta = voluntarios === representantesNecesarios && voluntarios > 0;
  const faltanVoluntarios = voluntarios < representantesNecesarios;

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

  async function handleVotarCandidato(candidatoId: string) {
    try {
      const res = await fetch(`/api/procesos/${procesoId}/votar-representante`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidato_id: candidatoId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCandidatos(prev => prev.map(c =>
          c.id === candidatoId
            ? { ...c, votos_count: data.voted ? c.votos_count + 1 : c.votos_count - 1, has_voted: data.voted }
            : c
        ));
      }
    } catch {
      setError('Error al votar.');
    }
  }

  async function handleResponderCargo(aceptar: boolean) {
    setRespondiendo(true);
    try {
      const res = await fetch(`/api/procesos/${procesoId}/responder-cargo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aceptar }),
      });
      if (res.ok) {
        const data = await res.json();
        setEstadoRepresentante(data.estado);
      }
    } catch {
      setError('Error al responder.');
    } finally {
      setRespondiendo(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Cargo pendiente: aceptar/rechazar (sorteo) */}
      {estadoRepresentante === 'pendiente' && (
        <div className="bg-purple-100 border-2 border-purple-400 rounded-xl p-5">
          <p className="text-base font-bold text-purple-900 mb-2">🎲 Has sido seleccionado por sorteo</p>
          <p className="text-sm text-purple-700 mb-4">No hubo suficientes voluntarios y has sido elegido por sorteo para representar a tus compañeros. Puedes aceptar o rechazar el cargo.</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleResponderCargo(true)}
              disabled={respondiendo}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              {respondiendo ? 'Procesando…' : 'Acepto el cargo'}
            </button>
            <button
              onClick={() => handleResponderCargo(false)}
              disabled={respondiendo}
              className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Rechazar
            </button>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      )}

      {estadoRepresentante === 'aceptado' && (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
          <p className="text-base font-bold text-green-900 mb-1">✅ Eres representante</p>
          <p className="text-sm text-green-700">Has aceptado el cargo. Cuando todos los representantes estén confirmados, se iniciará la Fase de Diálogo con la dirección.</p>
        </div>
      )}

      {estadoRepresentante === 'rechazado' && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Has rechazado el cargo de representante. Se realizará un nuevo sorteo para cubrir la vacante.</p>
        </div>
      )}

      {/* Main: volunteer button + chart (only when no cargo assigned) */}
      {!estadoRepresentante && (
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="flex-1">
            {confirmacionDirecta && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-green-800">✅ Hay exactamente {representantesNecesarios} voluntarios — los necesarios. Quedan confirmados como representantes.</p>
              </div>
            )}

            {hayVotacion && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">🗳 Hay más voluntarios que puestos.</span> Vota a los candidatos que prefieras. Se elegirán los {representantesNecesarios} más votados.
                </p>
              </div>
            )}

            {faltanVoluntarios && (
              <>
                <p className="text-gray-700 mb-4 text-sm">
                  Se necesitan <strong>{representantesNecesarios} representantes</strong>. Si no hay suficientes voluntarios, se realizará un <strong>sorteo</strong> entre todos los participantes.
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
                  </div>
                )}
              </>
            )}

            {hayVotacion && !esVoluntario && (
              <button
                onClick={handleVoluntario}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-4"
              >
                {loading ? 'Registrando…' : '🙋 También quiero presentarme'}
              </button>
            )}
          </div>

          {/* Chart */}
          <div className="flex flex-col items-center gap-2 min-w-[140px]">
            <svg width="120" height="120" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#e9d5ff" strokeWidth="12" />
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#9333ea" strokeWidth="12"
                strokeDasharray={circunferencia} strokeDashoffset={progreso} strokeLinecap="round"
                transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
              <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#7e22ce">{voluntarios}</text>
              <text x="50" y="62" textAnchor="middle" fontSize="10" fill="#a855f7">de {representantesNecesarios}</text>
            </svg>
            <p className="text-sm text-center text-gray-600 font-medium">Voluntarios</p>
            {representantesConfirmados > 0 && (
              <p className="text-xs text-green-700 font-semibold bg-green-50 px-3 py-1 rounded-full">
                {representantesConfirmados} confirmados
              </p>
            )}
          </div>
        </div>
      )}

      {/* Voting list */}
      {hayVotacion && candidatos.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-900 mb-3">Candidatos ({candidatos.length})</p>
          <div className="space-y-2">
            {[...candidatos].sort((a, b) => b.votos_count - a.votos_count).map(c => (
              <div key={c.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <button
                  onClick={() => handleVotarCandidato(c.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${
                    c.has_voted ? 'bg-purple-600 text-white' : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                  }`}
                >▲</button>
                <span className="text-base font-bold text-purple-600">{c.votos_count}</span>
                <span className="text-sm text-gray-800">{c.nombre || 'Candidato anónimo'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
