'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

type Fase = 1 | 2 | 3 | 4;

export default function DashboardPage() {
  const params = useParams();
  const procesoId = params.procesoId as string;

  // Mock data for demo
  const mockData = {
    procesoId,
    empresa: {
      nombre: 'TechCorp España',
      sector: 'tecnología',
      num_empleados: 45,
    },
    fase: 1 as Fase,
    estado: 'activo',
    empleados_unidos: 23,
    empleados_objetivo: 45,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const porcentaje = Math.round(
    (mockData.empleados_unidos / mockData.empleados_objetivo) * 100
  );

  const umbralProceso = Math.ceil(mockData.empleados_objetivo * 0.1); // 10% threshold

  const getPhaseTitle = (fase: Fase): string => {
    const titles: Record<Fase, string> = {
      1: 'Fase de Invitaciones',
      2: 'Fase de Propuestas',
      3: 'Fase de Representantes',
      4: 'Fase de Diálogo',
    };
    return titles[fase];
  };

  const getPhaseDescription = (fase: Fase): string => {
    const descriptions: Record<Fase, string> = {
      1: 'Esperando a que más empleados se unan al proceso. Se necesita al menos el 10% de participación para avanzar.',
      2: 'Los empleados pueden proponer sus ideas, quejas y consultas. El sistema genera un reporte PDF con las propuestas más votadas.',
      3: 'Se seleccionan representantes por voluntariado o sorteo para llevar las propuestas a la dirección.',
      4: 'Los representantes dialogan con la dirección de la empresa sobre las propuestas y buscan soluciones.',
    };
    return descriptions[fase];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 inline-block">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">La Cabina Colectiva</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bread crumb & Title */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-2">
            {mockData.empresa.nombre}
          </p>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard del Proceso</h2>
        </div>

        {/* Phase Indicator */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((phase) => (
              <div key={phase} className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-2 ${
                    phase <= mockData.fase
                      ? 'bg-indigo-600 text-white'
                      : phase === mockData.fase + 1
                        ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {phase}
                </div>
                <span className="text-xs text-gray-600 text-center">
                  {
                    [
                      'Invitaciones',
                      'Propuestas',
                      'Representantes',
                      'Diálogo',
                    ][phase - 1]
                  }
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {getPhaseTitle(mockData.fase)}
            </h3>
            <p className="text-gray-600 mb-6">
              {getPhaseDescription(mockData.fase)}
            </p>
          </div>
        </div>

        {/* Employee Participation Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación de Empleados</h3>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">
                {mockData.empleados_unidos} de {mockData.empleados_objetivo} empleados se han unido
              </span>
              <span className="text-2xl font-bold text-indigo-600">{porcentaje}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>

          {mockData.fase === 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Umbral para avanzar:</span> Se necesita al menos {umbralProceso} empleados ({Math.round((umbralProceso / mockData.empleados_objetivo) * 100)}%) para que el proceso avance a la siguiente fase.
              </p>
            </div>
          )}
        </div>

        {/* Phase-Specific Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sharing Instructions (Phase 1) */}
          {mockData.fase === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instrucciones para Compartir</h3>
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold block mb-2">1. Copia el enlace de invitación:</span>
                  <code className="bg-gray-100 px-3 py-2 rounded block break-all text-xs">
                    {typeof window !== 'undefined'
                      ? `${window.location.origin}/unirse/token_ejemplo_12345`
                      : 'unirse/token_ejemplo_12345'}
                  </code>
                </p>
                <p>
                  <span className="font-semibold">2. Comparte el enlace con tus colegas por Slack, correo o teams</span>
                </p>
                <p>
                  <span className="font-semibold">3. Cuantos más se unan, más peso tendrán vuestras propuestas</span>
                </p>
              </div>
            </div>
          )}

          {/* Proposals Link (Phase 2+) */}
          {mockData.fase >= 2 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Propuestas y Votación</h3>
              <p className="text-gray-600 mb-6">
                Accede a la página de propuestas para ver, votar y crear nuevas propuestas.
              </p>
              <Link
                href={`/dashboard/${procesoId}/propuestas`}
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Ver Propuestas
              </Link>
            </div>
          )}

          {/* Representative Selection (Phase 3) */}
          {mockData.fase === 3 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selección de Representantes</h3>
              <p className="text-gray-600 mb-6">
                Se están seleccionando representantes. Puedes ofrecerte como voluntario o ser seleccionado por sorteo.
              </p>
              <button className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Ser Representante
              </button>
            </div>
          )}

          {/* Dialogue Phase (Phase 4) */}
          {mockData.fase === 4 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fase de Diálogo</h3>
              <p className="text-gray-600 mb-6">
                Los representantes están dialogando con la dirección. Aquí aparecerán las respuestas.
              </p>
              <button className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Ver Resultados
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
