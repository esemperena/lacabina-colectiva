'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Propuesta {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'propuesta' | 'queja' | 'consulta' | 'sugerencia';
  es_anonima: boolean;
  votos_count: number;
  has_voted: boolean;
}

const getTipoBadge = (tipo: string) => {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    propuesta: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Propuesta' },
    queja: { bg: 'bg-red-100', text: 'text-red-800', label: 'Queja' },
    consulta: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Consulta' },
    sugerencia: { bg: 'bg-green-100', text: 'text-green-800', label: 'Sugerencia' },
  };
  return badges[tipo] || badges.propuesta;
};

interface Props {
  propuestasIniciales: Propuesta[];
  participanteId: string;
  procesoId: string;
  fase: number;
  misPropostas: number;
  listoFase2: boolean;
  isAdminView: boolean;
  empresaNombre: string;
  fase2FinalEn?: string | null; // ISO date
}

const MAX_PROPUESTAS = 6;

export default function PropuestasClient({
  propuestasIniciales,
  participanteId,
  procesoId,
  fase,
  misPropostas,
  listoFase2,
  isAdminView,
  empresaNombre,
  fase2FinalEn,
}: Props) {
  const [propuestas, setPropuestas] = useState<Propuesta[]>(propuestasIniciales);
  const [enviadas, setEnviadas] = useState(misPropostas);
  const [yaListo, setYaListo] = useState(listoFase2);

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'propuesta' as const,
    es_anonima: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [marcandoListo, setMarcandoListo] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Sorted by votes desc
  const sorted = [...propuestas].sort((a, b) => b.votos_count - a.votos_count);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (enviadas >= MAX_PROPUESTAS) {
      setError(`Ya has enviado el máximo de ${MAX_PROPUESTAS} ideas.`);
      return;
    }
    if (!form.titulo.trim() || !form.descripcion.trim()) {
      setError('El título y la descripción son obligatorios.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/propuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proceso_id: procesoId,
          titulo: form.titulo,
          descripcion: form.descripcion,
          tipo: form.tipo,
          es_anonima: form.es_anonima,
          participante_id: participanteId,
        }),
      });
      if (!res.ok) throw new Error('Error al enviar');
      const data = await res.json();
      setPropuestas(prev => [
        { id: data.id, titulo: form.titulo, descripcion: form.descripcion, tipo: form.tipo, es_anonima: form.es_anonima, votos_count: 0, has_voted: false },
        ...prev,
      ]);
      setEnviadas(prev => prev + 1);
      setForm({ titulo: '', descripcion: '', tipo: 'propuesta', es_anonima: true });
      setExito('¡Idea enviada! Gracias por participar.');
      setTimeout(() => setExito(''), 4000);
    } catch {
      setError('Error al enviar la propuesta. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVote(propuestaId: string) {
    if (isAdminView) return;
    try {
      const res = await fetch('/api/votos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propuesta_id: propuestaId, participante_id: participanteId }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setPropuestas(prev => prev.map(p =>
        p.id === propuestaId
          ? { ...p, votos_count: data.voted ? p.votos_count + 1 : p.votos_count - 1, has_voted: data.voted }
          : p
      ));
    } catch {
      setError('Error al registrar el voto.');
    }
  }

  async function handleListo() {
    setMarcandoListo(true);
    try {
      const res = await fetch(`/api/procesos/${procesoId}/listo`, {
        method: 'POST',
      });
      if (res.ok) {
        setYaListo(true);
        setExito('✅ Marcado. Cuando todos los participantes lo confirmen (o pasen 2 semanas), el proceso avanzará a la Fase 3.');
      }
    } catch {
      setError('Error al enviar la confirmación.');
    } finally {
      setMarcandoListo(false);
    }
  }

  // Days left in phase 2
  let diasRestantes: number | null = null;
  if (fase2FinalEn) {
    const diff = new Date(fase2FinalEn).getTime() - Date.now();
    diasRestantes = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href={`/dashboard/${procesoId}`} className="text-teal-600 hover:underline text-sm">
              ← Dashboard
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Propuestas e ideas</h1>
              <p className="text-sm text-gray-500 mt-1">{empresaNombre}</p>
            </div>
            {isAdminView && (
              <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
                Vista admin
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Phase 2 countdown + listo button */}
        {fase === 2 && !isAdminView && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-teal-900">Fase 2 en curso</p>
              {diasRestantes !== null ? (
                <p className="text-sm text-teal-700 mt-1">
                  {diasRestantes > 0 ? `${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} restantes` : 'La fase finaliza hoy'}
                </p>
              ) : (
                <p className="text-sm text-teal-700 mt-1">Dura 2 semanas o hasta que todos confirmen que no tienen más ideas.</p>
              )}
            </div>
            {!yaListo ? (
              <button
                onClick={handleListo}
                disabled={marcandoListo}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                {marcandoListo ? 'Confirmando…' : 'Ya no tengo más ideas'}
              </button>
            ) : (
              <span className="text-sm text-teal-700 font-semibold bg-teal-100 px-4 py-2 rounded-lg">
                ✅ Has confirmado que no tienes más ideas
              </span>
            )}
          </div>
        )}

        {/* Submit form — only phase 2, non-admin, under limit */}
        {fase === 2 && !isAdminView && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Enviar una idea</h2>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${enviadas >= MAX_PROPUESTAS ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'}`}>
                {enviadas} / {MAX_PROPUESTAS} ideas enviadas
              </span>
            </div>

            {enviadas >= MAX_PROPUESTAS ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-600">
                Has alcanzado el límite de {MAX_PROPUESTAS} ideas. ¡Gracias por tu participación!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Título</label>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    placeholder="Ej: Mejorar el horario de trabajo"
                    maxLength={120}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Tipo</label>
                  <select
                    value={form.tipo}
                    onChange={e => setForm(f => ({ ...f, tipo: e.target.value as typeof form.tipo }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  >
                    <option value="propuesta">Propuesta</option>
                    <option value="queja">Queja</option>
                    <option value="consulta">Consulta</option>
                    <option value="sugerencia">Sugerencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Descripción</label>
                  <textarea
                    value={form.descripcion}
                    onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                    rows={4}
                    placeholder="Explica tu idea con el detalle que quieras..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonima"
                    checked={form.es_anonima}
                    onChange={e => setForm(f => ({ ...f, es_anonima: e.target.checked }))}
                    className="w-5 h-5 text-teal-600 rounded border-gray-300"
                  />
                  <label htmlFor="anonima" className="text-sm text-gray-700 cursor-pointer">
                    Enviar de forma anónima <span className="text-gray-400">(nadie verá tu nombre)</span>
                  </label>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
                {exito && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{exito}</div>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Enviando…' : 'Enviar idea'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Global messages for admin/phase 3 */}
        {exito && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{exito}</div>}
        {error && fase !== 2 && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        {/* Proposals list */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Ideas de los empleados <span className="text-gray-400 font-normal text-base">({sorted.length})</span>
          </h2>

          {sorted.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
              <p className="text-lg mb-2">Aún no hay ideas enviadas.</p>
              <p className="text-sm">Sé el primero en compartir una propuesta.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map(propuesta => {
                const badge = getTipoBadge(propuesta.tipo);
                return (
                  <div key={propuesta.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                      {/* Vote column */}
                      <div className="flex flex-col items-center gap-1 min-w-[52px]">
                        <button
                          onClick={() => handleVote(propuesta.id)}
                          disabled={isAdminView}
                          title={isAdminView ? 'Vista admin — no se puede votar' : propuesta.has_voted ? 'Quitar voto' : 'Votar'}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            isAdminView
                              ? 'bg-gray-100 text-gray-400 cursor-default'
                              : propuesta.has_voted
                                ? 'bg-teal-600 text-white hover:bg-teal-700'
                                : 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50'
                          }`}
                        >
                          ▲
                        </button>
                        <span className="text-lg font-bold text-teal-600">{propuesta.votos_count}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                          {propuesta.es_anonima && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                              🔒 Anónimo
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{propuesta.titulo}</h3>
                        <p className="text-gray-600 text-sm">{propuesta.descripcion}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
