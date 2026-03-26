'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LogoLink } from '@/components/Logo';

interface FormData {
  nombre: string;
  apellidos: string;
  sexo: string;
}

export default function UnirsePagePage() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [procesoId, setProcesoId] = useState<string>('');
  const [tokenAcceso, setTokenAcceso] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellidos: '',
    sexo: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!formData.apellidos.trim()) {
      setError('Los apellidos son obligatorios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/participantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          nombre: formData.nombre.trim(),
          apellidos: formData.apellidos.trim(),
          sexo: formData.sexo || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al unirse al proceso');
      }

      const data = await response.json();
      setProcesoId(data.proceso_id);
      setTokenAcceso(data.token_acceso);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al unirse al proceso');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <LogoLink />
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
            <div className="text-5xl mb-6">✓</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Ya eres parte del proceso!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Tu participación es confidencial. La empresa no sabrá que te has unido.
            </p>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Qué puedes hacer ahora:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">1.</span>
                  <span>Ver las propuestas de otros empleados y votar las que te importan</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">2.</span>
                  <span>Añadir tus propias ideas, quejas o consultas</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">3.</span>
                  <span>Seguir el proceso hasta que se elijan los representantes</span>
                </li>
              </ul>
            </div>
            <Link
              href={`/api/auth/verify/${tokenAcceso}`}
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Ir al proceso
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <LogoLink />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Únete al proceso
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Tus datos son confidenciales. La empresa no sabrá que te has unido al proceso si no quieres.
          </p>

          {/* Confidentiality notice */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-teal-800">
              🔒 <span className="font-semibold">Tus datos son confidenciales</span> y solo se usan para mejorar el análisis del proceso. No se compartirán con tu empresa sin tu consentimiento.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                placeholder="Tus apellidos"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Género
              </label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
              >
                <option value="">Prefiero no especificar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Uniéndome...' : 'Unirme al proceso'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
