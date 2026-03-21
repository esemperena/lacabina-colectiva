'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface FormData {
  nombre?: string;
  edad?: string;
  sexo?: string;
  anonimidad_confirmada: boolean;
}

export default function UnirsePagePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [procesoId, setProcesoId] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    edad: '',
    sexo: '',
    anonimidad_confirmada: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.anonimidad_confirmada) {
      setError('Debes confirmar que entiendes que el proceso es anónimo');
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
          nombre: formData.nombre || undefined,
          edad: formData.edad ? parseInt(formData.edad) : undefined,
          sexo: formData.sexo || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al unirse al proceso');
      }

      const data = await response.json();
      setProcesoId(data.proceso_id);
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
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-70">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">La Cabina Colectiva</h1>
            </Link>
          </div>
        </header>

        {/* Success Message */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
            <div className="text-5xl mb-6">✓</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Te has unido exitosamente!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Ahora eres parte del proceso de representación colectiva.
            </p>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Qué sigue:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">1.</span>
                  <span>Accede al dashboard para ver propuestas de otros empleados</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">2.</span>
                  <span>Propone tus ideas, quejas o consultas</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">3.</span>
                  <span>Vota las propuestas que te importan</span>
                </li>
              </ul>
            </div>
            <Link
              href={`/dashboard/${procesoId}`}
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Ir al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">La Cabina Colectiva</h1>
          </Link>
        </div>
      </header>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Estás a punto de unirte al proceso
          </h2>
          <p className="text-gray-600 mb-8">
            Tus datos son opcionales. Solo mantén anónimo lo que quieras.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Privacidad:</span> Este proceso es completamente anónimo. Nadie sabrá quién eres a menos que lo reveles voluntariamente.
              </p>
            </div>

            {/* Name (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nombre <span className="text-gray-500 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                placeholder="Tu nombre (si lo deseas compartir)"
              />
            </div>

            {/* Age (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Edad <span className="text-gray-500 font-normal">(opcional)</span>
              </label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                min="18"
                max="120"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                placeholder="Tu edad (si lo deseas)"
              />
            </div>

            {/* Sex (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Género <span className="text-gray-500 font-normal">(opcional)</span>
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

            {/* Anonymity Confirmation */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="anonimidad_confirmada"
                  checked={formData.anonimidad_confirmada}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm text-green-800">
                  Confirmo que entiendo que este proceso es <span className="font-semibold">completamente anónimo</span>. Mi participación será privada y segura.
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Uniéndote...' : 'Unirme al Proceso'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
