'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.nombre || !formData.sector || !formData.num_empleados || !formData.rrhh_email) {
        setError('Por favor, completa todos los campos');
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
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0);

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
          <Link href="/" className="flex items-center gap-2 hover:opacity-70">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">La Cabina Colectiva</h1>
          </Link>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s <= step
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-20 h-1 ${
                      s < step ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  />
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

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Initiator Email */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu correo</h2>
              <p className="text-gray-600 mb-8">
                Usaremos este email para enviarte el enlace de acceso al proceso. No lo almacenamos en texto plano — se convierte en un código irreversible que protege tu identidad.
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
                    <span className="font-semibold">Privacidad garantizada:</span> Tu correo será hasheado inmediatamente y nunca se guardará en texto plano. Nadie sabrá que iniciaste este proceso.
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
              <p className="text-gray-600 mb-8">
                Añade los correos de tus compañeros. Cuantos más se unan, más representativo será el proceso. Sepáralos por coma o por línea.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Correos de los colegas
                  </label>
                  <textarea
                    name="colegas_emails"
                    value={formData.colegas_emails}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 font-mono text-sm text-gray-900"
                    placeholder="colega1@empresa.com&#10;colega2@empresa.com&#10;colega3@empresa.com"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Las invitaciones no revelan quién inició el proceso.</span> Cada compañero recibirá un enlace único y anónimo.
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
              disabled={loading}
              className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando...' : step === 3 ? 'Crear Proceso' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
