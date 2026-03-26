'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogoLink } from '@/components/Logo';

type Step = 1 | 2 | 3;

interface FormData {
  nombre: string;
  sector: string;
  num_empleados: string;
  rrhh_email: string;
  iniciador_email: string;
  colegas_emails: string;
}

export default function IniciarPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [procesoId, setProcesoId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    sector: '',
    num_empleados: '',
    rrhh_email: '',
    iniciador_email: '',
    colegas_emails: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error de empresa pequeña si cambia el número de empleados
    if (name === 'num_empleados' && error === 'EMPRESA_PEQUENA') {
      setError('');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.nombre || !formData.sector || !formData.num_empleados || !formData.rrhh_email) {
        setError('Por favor, completa todos los campos');
        return;
      }
      const numEmp = parseInt(formData.num_empleados);
      if (numEmp < 6) {
        setError('EMPRESA_PEQUENA');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (!formData.iniciador_email) {
        setError('Por favor, ingresa tu correo');
        return;
      }
      setError('');
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!formData.colegas_emails) {
      setError('Por favor, añade al menos un correo de colega');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Parse colleagues emails
      const colegas = formData.colegas_emails
        .split(/[,;\s\n]+/)
        .map(email => email.trim())
        .filter(email => email.includes('@') && email.length > 0);

      const response = await fetch('/api/procesos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          sector: formData.sector,
          num_empleados: parseInt(formData.num_empleados),
          rrhh_email: formData.rrhh_email,
          iniciador_email: formData.iniciador_email,
          colegas_emails: colegas,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el proceso');
      }

      const data = await response.json();
      setProcesoId(data.proceso_id);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el proceso');
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
            <LogoLink />
          </div>
        </header>

        {/* Success Message */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
            <div className="text-5xl mb-6">✓</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Proceso creado exitosamente!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Tu ID de proceso es: <span className="font-mono font-bold text-teal-600">{procesoId}</span>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">📧 RRHH ha sido notificado.</span> Hemos enviado un email a Recursos Humanos informándoles de que se ha iniciado un proceso. En ese email <strong>no aparece quién lo ha iniciado</strong> — tu anonimato está protegido.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Próximos pasos:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">1.</span>
                  <span>Hemos enviado invitaciones a {formData.colegas_emails.split(/[,\n]/).filter(e => e.trim()).length} compañeros</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">2.</span>
                  <span>Espera a que se unan suficientes compañeros. Cuando se alcance el umbral de participación, el proceso avanzará automáticamente a la Fase 2.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-teal-600">3.</span>
                  <span>Accede al dashboard desde el enlace que te hemos enviado a tu correo.</span>
                </li>
              </ul>
            </div>
            <Link
              href="/"
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Volver al inicio
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
          <LogoLink />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            {[
              { num: 1, label: 'Tu empresa', desc: 'Datos básicos y RRHH' },
              { num: 2, label: 'Tu acceso', desc: 'Correo confidencial' },
              { num: 3, label: 'Tus compañeros', desc: 'Invitar por email' },
            ].map(({ num, label, desc }) => (
              <div key={num} className="flex items-start flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                      num < step
                        ? 'bg-teal-600 text-white'
                        : num === step
                        ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {num < step ? '✓' : num}
                  </div>
                  <p className={`mt-2 text-xs font-semibold text-center ${num <= step ? 'text-teal-700' : 'text-gray-400'}`}>
                    {label}
                  </p>
                  <p className={`text-xs text-center ${num <= step ? 'text-gray-500' : 'text-gray-300'}`}>
                    {desc}
                  </p>
                </div>
                {num < 3 && (
                  <div className="flex-1 flex items-center pt-5">
                    <div className={`h-0.5 w-full mx-2 transition-colors ${num < step ? 'bg-teal-500' : 'bg-gray-200'}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Step 1: Company Data */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Información de la empresa</h2>
              <p className="text-gray-600 mb-8">Cuéntanos sobre tu empresa para iniciar el proceso</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nombre de la empresa
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                    placeholder="Ej: TechCorp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Sector
                  </label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                  >
                    <option value="">Selecciona un sector</option>
                    <option value="tecnología">Tecnología</option>
                    <option value="retail">Retail</option>
                    <option value="manufactura">Manufactura</option>
                    <option value="servicios">Servicios</option>
                    <option value="finanzas">Finanzas</option>
                    <option value="salud">Salud</option>
                    <option value="educación">Educación</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Número de empleados
                  </label>
                  <input
                    type="number"
                    name="num_empleados"
                    value={formData.num_empleados}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                    placeholder="Ej: 150"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Correo de recursos humanos
                  </label>
                  <input
                    type="email"
                    name="rrhh_email"
                    value={formData.rrhh_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                    placeholder="rrhh@empresa.com"
                  />
                </div>

                {error === 'EMPRESA_PEQUENA' ? (
                  <div className="bg-amber-50 border border-amber-300 rounded-lg p-5">
                    <p className="font-semibold text-amber-900 mb-2">⚖️ Tu empresa no necesita representantes sindicales</p>
                    <p className="text-sm text-amber-800 mb-3">
                      Según el <strong>Estatuto de los Trabajadores (art. 62)</strong>, las empresas con menos de 6 empleados no están obligadas a tener delegados de personal ni comité de empresa.
                    </p>
                    <p className="text-sm text-amber-700">
                      La Cabina Colectiva está diseñada para empresas de 6 o más empleados. Si tu equipo crece en el futuro, ¡vuelve cuando llegues a ese umbral!
                    </p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Step 2: Initiator Email */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu correo</h2>
              <p className="text-gray-600 mb-8">
                Usaremos este email para enviarte el enlace de acceso y mantenerte informado sobre el proceso. No se compartirá con tu empresa.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tu correo corporativo
                  </label>
                  <input
                    type="email"
                    name="iniciador_email"
                    value={formData.iniciador_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                    placeholder="tu.email@empresa.com"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Confidencialidad garantizada:</span> Tu empresa no sabrá que iniciaste este proceso. Tu correo se usa únicamente para enviarte notificaciones.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Colleague Emails */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invita a tus compañeros</h2>
              <p className="text-gray-600 mb-6">
                Pega aquí todos los emails a la vez. Puedes copiarlos de Outlook, Gmail, Excel o cualquier lista.
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-semibold mb-1">💡 Cómo pegar emails fácilmente</p>
                  <p className="text-sm text-blue-700">Puedes separarlos por <strong>comas</strong>, <strong>punto y coma</strong>, <strong>espacios</strong> o <strong>saltos de línea</strong>. Pega directamente desde tu gestor de correo o Excel y lo detectamos automáticamente.</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-900">
                      Correos de los compañeros
                    </label>
                    {formData.colegas_emails.trim() && (
                      <span className="text-sm font-semibold text-teal-600">
                        {formData.colegas_emails.split(/[,;\s\n]+/).filter(e => e.includes('@')).length} emails detectados
                      </span>
                    )}
                  </div>
                  <textarea
                    name="colegas_emails"
                    value={formData.colegas_emails}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 font-mono text-sm text-gray-900"
                    placeholder={`colega1@empresa.com, colega2@empresa.com\no bien uno por línea:\ncolega3@empresa.com\ncolega4@empresa.com`}
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Las invitaciones no revelan quién inició el proceso.</span> Cada compañero recibirá un enlace único y confidencial.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Anonymity reminder */}
          <div className="mt-8 mb-4 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <span className="text-teal-600 text-lg mt-0.5">🔒</span>
            <p className="text-sm text-teal-800">
              <span className="font-semibold">Tu anonimato está protegido.</span> La empresa nunca sabrá quién inició este proceso. Tu identidad no se revela en ningún momento.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
            )}
            <button
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={loading || error === 'EMPRESA_PEQUENA'}
              className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : step === 3 ? 'Crear Proceso' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
