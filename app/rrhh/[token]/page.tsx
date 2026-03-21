import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';

interface Propuesta {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'propuesta' | 'queja' | 'consulta' | 'sugerencia';
  votos_count: number;
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

export default async function RRHHPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Fetch proceso by token_rrhh
  const { data: proceso, error: procesoError } = await supabaseAdmin
    .from('procesos')
    .select('*, empresa:empresas(*)')
    .eq('token_rrhh', token)
    .single();

  if (!proceso || procesoError) {
    redirect('/');
  }

  // Fetch real propuestas
  const { data: propuestas } = await supabaseAdmin
    .from('propuestas')
    .select('*')
    .eq('proceso_id', proceso.id)
    .order('votos_count', { ascending: false });

  const listaPropuestas = propuestas || [];

  // Calculate real stats
  const empresa = proceso.empresa as { nombre: string; num_empleados: number };
  const porcentaje = Math.round((proceso.empleados_unidos / proceso.empleados_objetivo) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 inline-block mb-4">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">La Cabina Colectiva</h1>
          </Link>
          <p className="text-sm text-gray-600">Vista de Recursos Humanos</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Company Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {empresa.nombre}
          </h2>
          <p className="text-gray-600 mb-8">
            Estado actual del proceso de representación colectiva
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Employee Count */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Participación de Empleados</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-teal-600">
                  {proceso.empleados_unidos}
                </span>
                <span className="text-gray-600">de {proceso.empleados_objetivo}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-teal-600 h-full"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {porcentaje}% de participación
              </p>
            </div>

            {/* Proposals Count */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Total de Propuestas</p>
              <p className="text-3xl font-bold text-teal-600 mb-3">
                {listaPropuestas.length}
              </p>
              <p className="text-sm text-gray-600">
                Propuestas de empleados
              </p>
            </div>

            {/* Key Stats */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Tipos de Contribuciones</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  <span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'propuesta').length}</span> Propuestas
                </li>
                <li>
                  <span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'queja').length}</span> Quejas
                </li>
                <li>
                  <span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'consulta').length}</span> Consultas
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">🔒 Privacidad de Participantes</h3>
          <p className="text-sm text-blue-800">
            No puedes ver la identidad de los empleados que se han unido. Todas las propuestas mostradas son anonimizadas. Esto garantiza la confidencialidad del proceso.
          </p>
        </div>

        {/* Increase Participation CTA */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-8 mb-12">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">Aumentar Participación</h3>
          <p className="text-teal-800 mb-6">
            Para que el proceso avance, necesitas que al menos el 10% de los empleados ({Math.ceil(proceso.empleados_objetivo * 0.1)}) se unan.
            Actualmente tienes {proceso.empleados_unidos} participantes.
          </p>
          <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
            Enviar Recordatorio a Empleados
          </button>
        </div>

        {/* Proposals Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Propuestas Principales ({listaPropuestas.length})
          </h3>

          {listaPropuestas.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              <p>Todavía no hay propuestas. Se mostrarán aquí cuando los empleados las envíen en la Fase 2.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {listaPropuestas.map(propuesta => {
                const badge = getTipoBadge(propuesta.tipo);
                return (
                  <div
                    key={propuesta.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Votos</p>
                        <p className="text-2xl font-bold text-teal-600">
                          {propuesta.votos_count}
                        </p>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {propuesta.titulo}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {propuesta.descripcion}
                    </p>

                    <div className="border-t border-gray-200 pt-4">
                      <button className="text-teal-600 font-semibold hover:text-teal-700 text-sm">
                        Ver Detalles →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Export/Report Section */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generar Reporte</h3>
          <p className="text-gray-600 mb-6">
            Descarga un reporte completo en PDF con todas las propuestas y sus votos.
          </p>
          <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Descargar Reporte PDF
          </button>
        </div>
      </div>
    </div>
  );
}
