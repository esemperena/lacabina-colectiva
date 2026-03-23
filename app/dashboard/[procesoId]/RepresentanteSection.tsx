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
  subfase: string;
  esVoluntario: boolean;
  declinaRepresentante: boolean;
  voluntariosActuales: number;
  representantesNecesarios: number;
  totalParticipantes: number;
  hanDecidido: number;
  estadoRepresentante: string | null;
  candidatos?: Candidato[];
  representantesConfirmados?: number;
  diasRestantes?: number;
}

export default function RepresentanteSection({
  procesoId,
  participanteId,
  subfase: subfaseInicial,
  esVoluntario: esVoluntarioInicial,
  declinaRepresentante: declinaInicial,
  voluntariosActuales: voluntariosIniciales,
  representantesNecesarios,
  totalParticipantes,
  hanDecidido: hanDecididoInicial,
  estadoRepresentante: estadoInicial,
  candidatos: candidatosIniciales = [],
  representantesConfirmados = 0,
  diasRestantes = 14,
}: Props) {
  const [esVoluntario, setEsVoluntario] = useState(esVoluntarioInicial);
  const [declina, setDeclina] = useState(declinaInicial);
  const [voluntarios, setVoluntarios] = useState(voluntariosIniciales);
  const [hanDecidido, setHanDecidido] = useState(hanDecididoInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estadoRepresentante, setEstadoRepresentante] = useState(estadoInicial);
  const [candidatos, setCandidatos] = useState(candidatosIniciales);
  const [respondiendo, setRespondiendo] = useState(false);

  const yaDecidido = esVoluntario || declina;

  // Progress: participants who have decided
  const porcentajeDecision = totalParticipantes > 0
    ? Math.min(100, Math.round((hanDecidido / totalParticipantes) * 100))
    : 0;

  async function handleAccion(accion: 'voluntario' | 'revertir' | 'declinar') {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/procesos/${procesoId}/voluntario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participante_id: participanteId, accion }),
      });
      if (res.ok) {
        const data = await res.json();
        const eraVoluntario = esVoluntario;
        const eraDeclinado = declina;
        setEsVoluntario(data.es_voluntario);
        setDeclina(data.declina_representante);

        // Update counters
        if (accion === 'voluntario') {
          setVoluntarios(v => v + 1);
          if (!eraVoluntario && !eraDeclinado) setHanDecidido(h => h + 1);
        } else if (accion === 'declinar') {
          if (eraVoluntario) setVoluntarios(v => v - 1);
          if (!eraVoluntario && !eraDeclinado) setHanDecidido(h => h + 1);
        } else if (accion === 'revertir') {
          if (eraVoluntario) setVoluntarios(v => v - 1);
          setHanDecidido(h => h - 1);
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Error al procesar');
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

  // ═══ SUBFASE: CANDIDATURA ══════════════════════════════════════════
  if (subfaseInicial === 'candidatura') {
    return (
      <div className="space-y-5">
        {/* Progress bar: decisions */}
        <div className="bg-white/60 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              <strong className="text-gray-900">{hanDecidido}</strong> de {totalParticipantes} participantes han decidido
            </span>
            <span className="text-sm font-bold text-purple-600">{porcentajeDecision}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${porcentajeDecision}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {diasRestantes > 0
              ? `Quedan ${diasRestantes} días para decidir. Si no decides, entrarás en el sorteo.`
              : 'El plazo ha finalizado.'}
          </p>
        </div>

        {/* Volunteer counter */}
        <div className="flex items-center gap-4 bg-white/60 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-600">{voluntarios}</span>
            <span className="text-sm text-gray-500">voluntarios</span>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-700">{representantesNecesarios}</span>
            <span className="text-sm text-gray-500">necesarios</span>
          </div>
        </div>

        {/* Action buttons */}
        {!yaDecidido ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Se necesitan <strong>{representantesNecesarios} representantes</strong>. Puedes presentarte como voluntario o indicar que no quieres serlo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleAccion('voluntario')}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {loading ? 'Procesando…' : '🙋 Quiero ser representante'}
              </button>
              <button
                onClick={() => handleAccion('declinar')}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {loading ? 'Procesando…' : 'No me presentaré'}
              </button>
            </div>
          </div>
        ) : esVoluntario ? (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-800 font-semibold text-sm mb-2">✅ Te has presentado como voluntario</p>
            <button
              onClick={() => handleAccion('revertir')}
              disabled={loading}
              className="text-sm text-purple-600 hover:text-purple-800 underline disabled:opacity-50"
            >
              {loading ? 'Procesando…' : 'Cambiar de opinión'}
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 font-semibold text-sm mb-2">Has indicado que no te presentarás</p>
            <button
              onClick={() => handleAccion('revertir')}
              disabled={loading}
              className="text-sm text-purple-600 hover:text-purple-800 underline disabled:opacity-50"
            >
              {loading ? 'Procesando…' : 'Cambiar de opinión'}
            </button>
          </div>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    );
  }

  // ═══ SUBFASE: VOTACIÓN ══════════════════════════════════════════
  if (subfaseInicial === 'votacion') {
    return (
      <div className="space-y-5">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🗳 Fase de votación.</span> Hay más voluntarios ({voluntarios}) que puestos ({representantesNecesarios}). Vota a los candidatos que prefieras.
          </p>
        </div>

        {candidatos.length > 0 && (
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

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    );
  }

  // ═══ SUBFASE: SORTEO ══════════════════════════════════════════
  if (subfaseInicial === 'sorteo') {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">🎲 Sorteo necesario.</span> No hubo suficientes voluntarios ({voluntarios} de {representantesNecesarios} necesarios).
            {voluntarios > 0 && ` Los ${voluntarios} voluntarios quedan confirmados.`} Se sorteará entre los demás participantes.
          </p>
        </div>
        {representantesConfirmados > 0 && (
          <p className="text-sm text-green-700 font-medium">✅ {representantesConfirmados} representantes ya confirmados</p>
        )}
        <p className="text-xs text-gray-500">El sorteo se realizará automáticamente. Los seleccionados recibirán una notificación.</p>
      </div>
    );
  }

  // ═══ SUBFASE: CONFIRMACIÓN ══════════════════════════════════════
  if (subfaseInicial === 'confirmacion') {
    return (
      <div className="space-y-4">
        {/* If this user was selected by lottery and hasn't responded */}
        {estadoRepresentante === 'pendiente' && (
          <div className="bg-purple-100 border-2 border-purple-400 rounded-xl p-5">
            <p className="text-base font-bold text-purple-900 mb-2">🎲 Has sido seleccionado por sorteo</p>
            <p className="text-sm text-purple-700 mb-4">Has sido elegido por sorteo para representar a tus compañeros. Tienes 3 días para responder.</p>
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
            <p className="text-sm text-green-700">Has aceptado el cargo. Cuando todos los puestos estén cubiertos, se iniciará la Fase de Diálogo.</p>
          </div>
        )}

        {estadoRepresentante === 'rechazado' && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600">Has rechazado el cargo. Se realizará un nuevo sorteo para cubrir la vacante.</p>
          </div>
        )}

        {!estadoRepresentante && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">⏳ Confirmación en curso.</span> Los participantes seleccionados por sorteo están decidiendo si aceptan el cargo.
            </p>
          </div>
        )}

        {representantesConfirmados > 0 && (
          <p className="text-sm text-green-700 font-medium">✅ {representantesConfirmados} de {representantesNecesarios} representantes confirmados</p>
        )}
      </div>
    );
  }

  // ═══ SUBFASE: COMPLETADA ══════════════════════════════════════
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <p className="text-green-800 font-semibold">✅ Representantes seleccionados ({representantesConfirmados} de {representantesNecesarios})</p>
      <p className="text-sm text-green-700 mt-1">La selección de representantes ha finalizado. Se avanza a la Fase de Diálogo.</p>
    </div>
  );
}
