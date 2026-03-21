'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Propuesta {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'propuesta' | 'queja' | 'consulta' | 'sugerencia';
  es_anonima: boolean;
  votos: number;
  has_voted: boolean;
}

const mockPropuestas: Propuesta[] = [
  {
    id: '1',
    titulo: 'Mejorar el horario de trabajo',
    descripcion: 'Solicito la posibilidad de trabajar con horarios más flexibles, permitiendo compresión de jornada o teletrabajo algunos días.',
    tipo: 'propuesta',
    es_anonima: true,
    votos: 18,
    has_voted: false,
  },
  {
    id: '2',
    titulo: 'Aumento de capacitación profesional',
    descripcion: 'Aumentar el presupuesto anual para cursos y certificaciones profesionales para todos los empleados.',
    tipo: 'propuesta',
    es_anonima: true,
    votos: 15,
    has_voted: false,
  },
  {
    id: '3',
    titulo: 'Mejorar comunicación interna',
    descripcion: 'Necesitamos mejores canales de comunicación entre departamentos. Actualmente hay mucha desinformación.',
    tipo: 'queja',
    es_anonima: true,
    votos: 12,
    has_voted: false,
  },
  {
    id: '4',
    titulo: '¿Nuevos beneficios de salud?',
    descripcion: '¿Cuáles son los planes futuros para ampliar el paquete de beneficios de salud?',
    tipo: 'consulta',
    es_anonima: true,
    votos: 8,
    has_voted: false,
  },
];

const getTipoBadge = (tipo: string) => {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    propuesta: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Propuesta' },
    queja: { bg: 'bg-red-100', text: 'text-red-800', label: 'Queja' },
    consulta: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Consulta' },
    sugerencia: { bg: 'bg-green-100', text: 'text-green-800', label: 'Sugerencia' },
  };
  return badges[tipo] || badges.propuesta;
};

export default function PropuestasPage() {
  const params = useParams();
  const procesoId = params.procesoId as string;

  const [propuestas, setPropuestas] = useState<Propuesta[]>(mockPropuestas);
  const [newProposal, setNewProposal] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'propuesta' as const,
    es_anonima: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value, checked } = e.target as any;
    setNewProposal(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProposal.titulo || !newProposal.descripcion) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/propuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proceso_id: procesoId,
          titulo: newProposal.titulo,
          descripcion: newProposal.descripcion,
          tipo: newProposal.tipo,
          es_anonima: newProposal.es_anonima,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear propuesta');
      }

      const data = await response.json();

      // Add new proposal to list
      setPropuestas(prev => [
        {
          id: data.id,
          ...newProposal,
          votos: 0,
          has_voted: false,
        },
        ...prev,
      ]);

      // Reset form
      setNewProposal({
        titulo: '',
        descripcion: '',
        tipo: 'propuesta',
        es_anonima: true,
      });

      setSuccessMessage('¡Propuesta creada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear propuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (propuestaId: string) => {
    try {
      const response = await fetch('/api/votos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proceso_id: procesoId,
          propuesta_id: propuestaId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al votar');
      }

      // Update local state
      setPropuestas(prev =>
        prev.map(p =>
          p.id === propuestaId
            ? {
              ...p,
              votos: p.has_voted ? p.votos - 1 : p.votos + 1,
              has_voted: !p.has_voted,
            }
            : p
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al votar');
    }
  };

  // Sort by votes
  const sortedPropuestas = [...propuestas].sort((a, b) => b.votos - a.votos);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-70">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/dashboard/${procesoId}`}
              className="text-indigo-600 hover:underline"
            >
              Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Propuestas y Votación</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* New Proposal Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Enviar una Propuesta</h2>

          <form onSubmit={handleSubmitProposal} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Título
              </label>
              <input
                type="text"
                name="titulo"
                value={newProposal.titulo}
                onChange={handleInputChange}
                placeholder="Ej: Mejorar el horario de trabajo"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={newProposal.descripcion}
                onChange={handleInputChange}
                rows={4}
                placeholder="Explica tu propuesta con detalle..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={newProposal.tipo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="propuesta">Propuesta</option>
                  <option value="queja">Queja</option>
                  <option value="consulta">Consulta</option>
                  <option value="sugerencia">Sugerencia</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    name="es_anonima"
                    checked={newProposal.es_anonima}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    Mantener anónimo
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Propuesta'}
            </button>
          </form>
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">
            Propuestas ({sortedPropuestas.length})
          </h2>

          {sortedPropuestas.map(propuesta => {
            const badge = getTipoBadge(propuesta.tipo);
            return (
              <div
                key={propuesta.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                    {propuesta.es_anonima && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                        🔒 Anónimo
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {propuesta.titulo}
                </h3>
                <p className="text-gray-600 mb-4">
                  {propuesta.descripcion}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      <span className="font-bold text-lg text-indigo-600">
                        {propuesta.votos}
                      </span>{' '}
                      {propuesta.votos === 1 ? 'voto' : 'votos'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleVote(propuesta.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      propuesta.has_voted
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    {propuesta.has_voted ? '✓ Votado' : 'Votar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
