import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import UploadEmails from './UploadEmails';
import ContactForm from './ContactForm';
import AnuncioForm from './AnuncioForm';

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

const faseEmpleadosInfo: Record<number, { titulo: string; descripcion: string; icono: string }> = {
  1: {
    icono: '📨',
    titulo: 'Los empleados están uniéndose al proceso',
    descripcion: 'Los empleados están recibiendo invitaciones y accediendo al proceso de forma anónima. Cuantos más se unan antes de que comience la fase de propuestas, más representativo será el resultado.',
  },
  2: {
    icono: '💡',
    titulo: 'Los empleados están enviando y votando ideas',
    descripcion: 'En este momento los empleados pueden publicar propuestas, quejas, consultas o sugerencias de mejora, y votar las de sus compañeros. Al finalizar la fase, recibirás un informe con las más votadas.',
  },
  3: {
    icono: '🙋',
    titulo: 'Los empleados están eligiendo representantes',
    descripcion: 'Los empleados pueden presentarse como voluntarios para ser representantes. Al terminar el plazo de 2 semanas, los participantes votarán entre los candidatos. Si no hay suficientes voluntarios, se realizará un sorteo.',
  },
  4: {
    icono: '🤝',
    titulo: 'Los representantes están en diálogo con la dirección',
    descripcion: 'Los representantes elegidos por los empleados están iniciando el proceso formal de negociación y diálogo con la dirección de la empresa, presentando las propuestas más votadas.',
  },
};

export default async function RRHHPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: proceso, error: procesoError } = await supabaseAdmin
    .from('procesos').select('*, empresa:empresas(*)').eq('token_rrhh', token).single();

  if (!proceso || procesoError) redirect('/');

  const { data: propuestas } = await supabaseAdmin
    .from('propuestas').select('*').eq('proceso_id', proceso.id).order('votos_count', { ascending: false });

  const listaPropuestas = (propuestas || []) as Propuesta[];

  const { count: invitacionesCount } = await supabaseAdmin
    .from('invitaciones').select('id', { count: 'exact', head: true }).eq('proceso_id', proceso.id);

  const yaEnvioEmails = (invitacionesCount ?? 0) > 0;

  const { data: anunciosData } = await supabaseAdmin
    .from('anuncios').select('id, contenido, created_at')
    .eq('proceso_id', proceso.id).order('created_at', { ascending: false });

  const anuncios = anunciosData || [];

  const empresa = proceso.empresa as { nombre: string; num_empleados: number; rrhh_email: string };
  const porcentaje = Math.round((proceso.empleados_unidos / proceso.empleados_objetivo) * 100);
  const fase = Number(proceso.fase) as Fase;

  const phaseLabels = ['Invitaciones', 'Propuestas', 'Representantes', 'Diálogo'];
  const faseInfo = faseEmpleadosInfo[fase];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 inline-flex mb-3">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">La Cabina Colectiva</span>
          </Link>
          <p className="text-sm text-gray-500">Panel de Recursos Humanos · {empresa.nombre}</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Email upload */}
        <UploadEmails token={token} yaEnvioEmails={yaEnvioEmails} />

        {/* Compact timeline + participation */}
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
          {/* Participation bar */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              <strong className="text-gray-900">{proceso.empleados_unidos}</strong> / {proceso.empleados_objetivo} empleados
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-teal-500 h-full transition-all duration-500" style={{ width: `${Math.min(porcentaje, 100)}%` }} />
            </div>
            <span className="text-sm font-bold text-teal-600 whitespace-nowrap">{porcentaje}%</span>
          </div>

          {/* Thin horizontal timeline */}
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 mx-4" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-teal-500 mx-4 transition-all duration-500"
              style={{ width: `calc(${((fase - 1) / 3) * 100}% - 2rem)` }}
            />
            {[1, 2, 3, 4].map((phase) => (
              <div key={phase} className="relative flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                  phase < fase
                    ? 'bg-teal-500 border-teal-500 text-white'
                    : phase === fase
                      ? 'bg-teal-600 border-teal-600 text-white ring-4 ring-teal-100'
                      : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {phase < fase ? '✓' : phase}
                </div>
                <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${phase === fase ? 'text-teal-700' : 'text-gray-400'}`}>
                  {phaseLabels[phase - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* === ACTIVE PHASE: what employees are doing (purple) === */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">Fase activa</span>
            <span className="text-lg">{faseInfo.icono}</span>
          </div>
          <h3 className="text-lg font-bold text-purple-900 mb-2">{faseInfo.titulo}</h3>
          <p className="text-sm text-purple-700">{faseInfo.descripcion}</p>
        </div>

        {/* Participation stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Estadísticas del proceso</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Participación</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-teal-600">{proceso.empleados_unidos}</span>
                <span className="text-gray-500 text-sm">de {proceso.empleados_objetivo}</span>
              </div>
              <p className="text-sm text-gray-600">{porcentaje}% del total</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Propuestas</p>
              <p className="text-3xl font-bold text-teal-600 mb-1">{listaPropuestas.length}</p>
              <p className="text-sm text-gray-600">Enviadas por empleados</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Tipos</p>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><span>Propuestas</span><span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'propuesta').length}</span></div>
                <div className="flex justify-between"><span>Quejas</span><span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'queja').length}</span></div>
                <div className="flex justify-between"><span>Consultas</span><span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'consulta').length}</span></div>
                <div className="flex justify-between"><span>Sugerencias</span><span className="font-semibold">{listaPropuestas.filter(p => p.tipo === 'sugerencia').length}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🔒 Privacidad garantizada:</span> No puedes ver la identidad de los participantes. Todas las propuestas son anónimas por diseño.
          </p>
        </div>

        {/* Proposals list */}
        {(fase >= 2 && listaPropuestas.length > 0) && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Propuestas <span className="text-gray-400 font-normal text-base">({listaPropuestas.length})</span>
            </h3>
            {fase === 2 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">⏳ Fase de propuestas en curso.</span> Los empleados todavía están enviando y votando ideas. Las propuestas que ves aquí pueden cambiar de orden o aumentar en número hasta que finalice esta fase.
                </p>
              </div>
            )}
            <div className="space-y-3">
              {listaPropuestas.map(propuesta => {
                const badge = getTipoBadge(propuesta.tipo);
                return (
                  <div key={propuesta.id} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>{badge.label}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{propuesta.titulo}</h4>
                        <p className="text-gray-600 text-sm">{propuesta.descripcion}</p>
                      </div>
                      <div className="text-right ml-6 flex-shrink-0">
                        <p className="text-xs text-gray-400 mb-1">Votos</p>
                        <p className="text-2xl font-bold text-teal-600">{propuesta.votos_count}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Announcement board */}
        <AnuncioForm token={token} anunciosIniciales={anuncios} />

        {/* Contact Form */}
        <ContactForm token={token} empresaNombre={empresa.nombre} />

      </div>
    </div>
  );
}
