'use client';

import { useState } from 'react';

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
  fase2FinalEn?: string | null;
  nombreEmpleado?: string | null;
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
  fase2FinalEn,
  nombreEmpleado,
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

  const sorted = [...propuestas].sort((a, b) => b.votos_count - a.votos_count);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (enviadas >= MAX_PROPUESTAS) { setError(`Ya has enviado el máximo de ${MAX_PROPUESTAS} ideas.`); return; }
    if (!form.titulo.trim() || !form.descripcion.trim()) { setError('El título y la descripción son obligatorios.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/propuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proceso_id: procesoId, titulo: form.titulo, descripcion: form.descripcion, tipo: form.tipo, es_anonima: form.es_anonima, participante_id: participanteId }),
      });
      if (!res.ok) throw new Error('Error al enviar');
      const data = await res.json();
      setPropuestas(prev => [{ id: data.id, titulo: form.titulo, descripcion: form.descripcion, tipo: form.tipo, es_anonima: form.es_anonima, votos_count: 0, has_voted: false }, ...prev]);
      setEnviadas(prev => prev + 1);
      setForm({ titulo: '', descripcion: '', tipo: 'propuesta', es_anonima: true });
      setExito('¡Idea enviada!'); setTimeout(() => setExito(''), 4000);
    } catch { setError('Error al enviar la propuesta. Inténtalo de nuevo.'); }
    finally { setSubmitting(false); }
  }

  async function handleVote(propuestaId: string) {
    if (isAdminView || fase !== 2) return;
    try {
      const res = await fetch('/api/votos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propuesta_id: propuestaId, participante_id: participanteId }) });
      if (!res.ok) return;
      const data = await res.json();
      setPropuestas(prev => prev.map(p => p.id === propuestaId ? { ...p, votos_count: data.voted ? p.votos_count + 1 : p.votos_count - 1, has_voted: data.voted } : p));
    } catch { setError('Error al registrar el voto.'); }
  }

  async function handleListo() {
    setMarcandoListo(true);
    try {
      const res = await fetch(`/api/procesos/${procesoId}/listo`, { method: 'POST' });
      if (res.ok) { setYaListo(true); setExito('✅ Marcado. Cuando todos los participantes lo confirmen (o pasen 2 semanas), el proceso avanzará a la Fase 3.'); }
    } catch { setError('Error al enviar la confirmación.'); }
    finally { setMarcandoListo(false); }
  }

  let diasRestantes: number | null = null;
  if (fase2FinalEn) {
    const diff = new Date(fase2FinalEn).getTime() - Date.now();
    diasRestantes = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="space-y-6">
      {/* Phase 2 countdown + listo button */}
      {fase === 2 && !isAdminView && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-teal-900">Fase 2 en curso</p>
            {diasRestantes !== null ? (
              <p className="text-sm text-teal-700 mt-1">{diasRestantes > 0 ? `${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} restantes` : 'La fase finaliza hoy'}</p>
            ) : (
              <p className="text-sm text-teal-700 mt-1">Dura 2 semanas o hasta que todos confirmen que no tienen más ideas.</p>
            )}
            <p className="text-xs text-teal-600 mt-2">
              💡 Si todos los empleados pulsan <strong>&quot;Ya no tengo más ideas&quot;</strong>, el proceso avanzará antes de que termine el plazo.
            </p>
          </div>
          {!yaListo ? (
            <button onClick={handleListo} disabled={marcandoListo} className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm whitespace-nowrap">
              {marcandoListo ? 'Confirmando…' : 'Ya no tengo más ideas'}
            </button>
          ) : (
            <span className="text-sm text-teal-700 font-semibold bg-teal-100 px-4 py-2 rounded-lg whitespace-nowrap">✅ Confirmado</span>
          )}
        </div>
      )}

      {/* Submit form — only phase 2, non-admin */}
      {fase === 2 && !isAdminView && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900">Enviar una idea</h3>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${enviadas >= MAX_PROPUESTAS ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'}`}>
              {enviadas} / {MAX_PROPUESTAS}
            </span>
          </div>
          {enviadas >= MAX_PROPUESTAS ? (
            <p className="text-center text-gray-500 text-sm py-4">Has alcanzado el límite de {MAX_PROPUESTAS} ideas. ¡Gracias!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Título de tu idea" maxLength={120} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200" />
              <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as typeof form.tipo }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-teal-500">
                <option value="propuesta">Propuesta</option>
                <option value="queja">Queja</option>
                <option value="consulta">Consulta</option>
                <option value="sugerencia">Sugerencia</option>
              </select>
              <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={3} placeholder="Explica tu idea..." className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200" />
              <div className="flex items-center gap-3">
                <input type="checkbox" id="anonima" checked={form.es_anonima} onChange={e => setForm(f => ({ ...f, es_anonima: e.target.checked }))} className="w-4 h-4 text-teal-600 rounded border-gray-300" />
                <label htmlFor="anonima" className="text-sm text-gray-700 cursor-pointer">Enviar de forma anónima</label>
              </div>
              {!form.es_anonima && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nombre que aparecerá en la propuesta</label>
                  <input
                    type="text"
                    readOnly
                    value={nombreEmpleado || '(nombre no disponible)'}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm cursor-default"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tu nombre será visible para todos los participantes del proceso.</p>
                </div>
              )}
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
              {exito && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{exito}</div>}
              <button type="submit" disabled={submitting} className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50">
                {submitting ? 'Enviando…' : 'Enviar idea'}
              </button>
            </form>
          )}
        </div>
      )}

      {exito && fase !== 2 && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{exito}</div>}
      {error && fase !== 2 && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {/* Proposals list */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Ideas enviadas ({sorted.length})</p>
        {sorted.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm italic">Aún no hay ideas enviadas.</div>
        ) : (
          <div className="space-y-3">
            {sorted.map(propuesta => {
              const badge = getTipoBadge(propuesta.tipo);
              return (
                <div key={propuesta.id} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 min-w-[44px]">
                      <button
                        onClick={() => handleVote(propuesta.id)}
                        disabled={isAdminView || fase !== 2}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isAdminView || fase !== 2 ? 'bg-gray-100 text-gray-300 cursor-default' : propuesta.has_voted ? 'bg-teal-600 text-white hover:bg-teal-700' : 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50'}`}
                      >▲</button>
                      <span className="text-base font-bold text-teal-600">{propuesta.votos_count}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>{badge.label}</span>
                        {propuesta.es_anonima && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">🔒 Anónimo</span>}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{propuesta.titulo}</h4>
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
  );
}
