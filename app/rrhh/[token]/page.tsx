import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import UploadEmails from './UploadEmails';
import ContactForm from './ContactForm';

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

type Fase = 1 | 2 | 3 | 4;

export default async function RRHHPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: proceso, error: procesoError } = await supabaseAdmin
    .from('procesos')
    .select('*, empresa:empresas(*)')
    .eq('token_rrhh', token)
    .single();

  if (!proceso || procesoError) {
    redirect('/');
  }

  const { data: propuestas } = await supabaseAdmin
    .from('propuestas')
    .select('*')
    .eq('proceso_id', proceso.id)
    .order('votos_count', { ascending: false });

  const listaPropuestas = (propuestas || []) as Propuesta[];

  // Check if RRHH has already uploaded emails (any invitaciones exist for this proceso)
  const { count: invitacionesCount } = await supabaseAdmin
    .from('invitaciones')
    .select('id', { count: 'exact', head: true })
    .eq('proceso_id', proceso.id);

  const yaEnvioEmails = (invitacionesCount ?? 0) > 0;

  const empresa = proceso.empresa as { nombre: string; num_empleados: number; rrhh_email: string };
  const porcentaje = Math.round((proceso.empleados_unidos / proceso.empleados_objetivo) * 100);
  const fase = Number(proceso.fase) as Fase;

  const faseLabelMap: Record<number, string> = {
    1: 'Invitaciones',
    2: 'Propuestas',
    3: 'Representantes',
    4: 'Diálogo',
  };

  const faseDescMap: Record<number, string> = {
    1: 'Los empleados están recibiendo invitaciones para unirse al proceso de forma anónima.',
    2: 'Los empleados están enviando y votando sus ideas, propuestas y quejas.',
    3: 'Se seleccionan representantes para llevar las propuestas a la dirección.',
    4: 'Los representantes dialogan con la dirección sobre las propuestas más votadas.',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 inline-flex mb-4">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">La Cabina Colectiva</h1>
          </Link>
          <p className="text-sm text-gray-600">Vista de Recursos Humanos · {empresa.nombre}</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* Email upload: big amber (first time) or compact (already sent) */}
        <UploadEmails token={token} yaEnvioEmails={yaEnvioEmails} />

        {/* Phase Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Estado del proceso</h2>
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((phase) => (
              <div key={phase} className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-2 ${
                    phase <= fase
                      ? 'bg-teal-600 text-white'
                      : phase === fase + 1
                        ? 'bg-teal-100 text-teal-600 border-2 border-teal-600'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {phase}
                </div>
                <span className="text-xs text-gray-600 text-center">{faseLabelMap[phase]}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm font-semibold text-teal-700 mb-1">
              Fase actual: {faseLabelMap[fase]}
            </p>
            <p className="text-sm text-gray-600">{faseDescMap[fase]}</p>
          </div>
        </div>

        {/* Participation stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{empresa.nombre}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-gray-600 mb-2">Participación de empleados</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-teal-600">{proceso.empleados_unidos}</span>
                <span className="text-gray-600">de {proceso.empleados_objetivo}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-teal-600 h-full" style={{ width: `${porcentaje}%` }} />
              </div>
              <p className="text-sm text-gray-600 mt-2">{porcentaje}% de participación</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Total de propuestas</p>
              <p className="text-3xl font-bold text-teal-600 mb-3">{listaPropuestas.length}</p>
              <p className="text-sm text-gray-600">Enviadas por empleados</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Tipos de contribuciones</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'propuesta').length}</span> Propuestas</li>
                <li><span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'queja').length}</span> Quejas</li>
                <li><span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'consulta').length}</span> Consultas</li>
                <li><span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'sugerencia').length}</span> Sugerencias</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">🔒 Privacidad de participantes</h3>
          <p className="text-sm text-blue-800">
            No puedes ver la identidad de los empleados que se han unido. Todas las propuestas son anonimizadas. Esto garantiza la confidencialidad del proceso.
          </p>
        </div>

        {/* Proposals list */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Propuestas principales <span className="text-gray-400 font-normal text-base">({listaPropuestas.length})</span>
          </h3>

          {listaPropuestas.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              <p>Todavía no hay propuestas. Se mostrarán aquí cuando los empleados las envíen en la Fase 2.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listaPropuestas.map(propuesta => {
                const badge = getTipoBadge(propuesta.tipo);
                return (
                  <div key={propuesta.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-gray-900 mb-1">{propuesta.titulo}</h4>
                        <p className="text-gray-600 text-sm">{propuesta.descripcion}</p>
                      </div>
                      <div className="text-right ml-6 flex-shrink-0">
                        <p className="text-xs text-gray-500 mb-1">Votos</p>
                        <p className="text-2xl font-bold text-teal-600">{propuesta.votos_count}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Form */}
        <ContactForm token={token} empresaNombre={empresa.nombre} />

      </div>
    </div>
  );
}
