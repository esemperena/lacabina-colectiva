import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import CopyButton from './CopyButton';
import PropuestasClient from './propuestas/PropuestasClient';

type Fase = 1 | 2 | 3 | 4;

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ procesoId: string }>;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const adminToken = cookieStore.get('admin_token')?.value;

  const { procesoId } = await params;

  let isAdminView = false;
  let participanteId = '';
  let misPropostas = 0;
  let listoFase2 = false;

  // Check admin bypass first
  if (adminToken) {
    const { data: tokenData } = await supabaseAdmin
      .from('admin_tokens')
      .select('id, created_at')
      .eq('token', adminToken)
      .single();
    if (tokenData) {
      const tokenAge = Date.now() - new Date(tokenData.created_at).getTime();
      if (tokenAge <= 86400 * 1000) {
        isAdminView = true;
      }
    }
  }

  // If not admin, check employee session
  if (!isAdminView) {
    if (!sessionToken) {
      redirect('/login');
    }
    const { data: participante, error: participanteError } = await supabaseAdmin
      .from('participantes')
      .select('id, proceso_id, nombre, es_iniciador, propuestas_enviadas, listo_fase2')
      .eq('token_acceso', sessionToken)
      .single();

    if (!participante || participanteError || participante.proceso_id !== procesoId) {
      redirect('/login');
    }
    participanteId = participante.id;
    misPropostas = participante.propuestas_enviadas || 0;
    listoFase2 = participante.listo_fase2 || false;
  }

  // Fetch real proceso data
  const { data: proceso, error: procesoError } = await supabaseAdmin
    .from('procesos')
    .select('*, empresa:empresas(*)')
    .eq('id', procesoId)
    .single();

  if (!proceso || procesoError) {
    redirect('/login');
  }

  interface ProcesoData {
    id: string;
    fase: string;
    estado: string;
    empleados_unidos: number;
    empleados_objetivo: number;
    fase2_inicio?: string | null;
    empresa: {
      nombre: string;
      sector: string;
      num_empleados: number;
    };
  }

  const procesoData = proceso as ProcesoData;
  const fase = Number(procesoData.fase) as Fase;
  const porcentaje = Math.round(
    (procesoData.empleados_unidos / procesoData.empleados_objetivo) * 100
  );

  const umbralProceso = Math.ceil(procesoData.empleados_objetivo * 0.1);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://astounding-kashata-8c4839.netlify.app';
  const inviteLink = `${APP_URL}/invitar/${procesoId}`;

  // Fetch propuestas data (only needed for fase >= 2)
  let propuestasConVotos: Array<{
    id: string; titulo: string; descripcion: string;
    tipo: 'propuesta' | 'queja' | 'consulta' | 'sugerencia';
    es_anonima: boolean; votos_count: number; has_voted: boolean;
  }> = [];
  let fase2FinalEn: string | null = null;

  if (fase >= 2) {
    const { data: propuestasRaw } = await supabaseAdmin
      .from('propuestas')
      .select('id, titulo, descripcion, tipo, es_anonima, votos_count')
      .eq('proceso_id', procesoId)
      .order('votos_count', { ascending: false });

    let votedIds = new Set<string>();
    if (participanteId) {
      const { data: votos } = await supabaseAdmin
        .from('votos')
        .select('propuesta_id')
        .eq('participante_id', participanteId);
      if (votos) votedIds = new Set(votos.map(v => v.propuesta_id));
    }

    propuestasConVotos = (propuestasRaw || []).map(p => ({
      ...p,
      has_voted: votedIds.has(p.id),
    }));

    if (procesoData.fase2_inicio) {
      const fin = new Date(new Date(procesoData.fase2_inicio).getTime() + 14 * 24 * 60 * 60 * 1000);
      fase2FinalEn = fin.toISOString();
    }
  }

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
      2: 'Los empleados pueden proponer sus ideas, quejas y consultas.',
      3: 'Se seleccionan representantes por voluntariado o sorteo para llevar las propuestas a la dirección.',
      4: 'Los representantes dialogan con la dirección de la empresa sobre las propuestas y buscan soluciones.',
    };
    return descriptions[fase];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">La Cabina Colectiva</h1>
          </Link>
          {isAdminView && (
            <Link href="/admin" className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
              ← Volver al panel admin
            </Link>
          )}
        </div>
      </header>

      {/* Admin banner */}
      {isAdminView && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-amber-800 font-medium">
              👁 Estás viendo este dashboard en modo administrador. Los empleados ven esta misma vista.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div>
          <p className="text-sm text-gray-600 mb-1">{procesoData.empresa.nombre}</p>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard del Proceso</h2>
        </div>

        {/* Phase Indicator */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
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
                <span className="text-xs text-gray-600 text-center">
                  {['Invitaciones', 'Propuestas', 'Representantes', 'Diálogo'][phase - 1]}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{getPhaseTitle(fase)}</h3>
            <p className="text-gray-600">{getPhaseDescription(fase)}</p>
          </div>
        </div>

        {/* Employee Participation Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación de Empleados</h3>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">
                {procesoData.empleados_unidos} de {procesoData.empleados_objetivo} empleados se han unido
              </span>
              <span className="text-2xl font-bold text-teal-600">{porcentaje}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-teal-600 h-full transition-all duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>

          {fase === 1 && (
            procesoData.empleados_unidos >= umbralProceso ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-semibold">
                  ✅ Umbral alcanzado — el proceso avanzará a la Fase 2 en breve.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Umbral para avanzar:</span> Se necesita al menos {umbralProceso} empleados ({Math.round((umbralProceso / procesoData.empleados_objetivo) * 100)}%) para que el proceso avance. Faltan {umbralProceso - procesoData.empleados_unidos}.
                </p>
              </div>
            )
          )}
        </div>

        {/* Fase 1: Invite link */}
        {fase === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invita a más compañeros</h3>
            <div className="space-y-4 text-sm text-gray-700 mb-6">
              <p>Comparte este enlace con cualquier compañero que quieras sumar al proceso. Cuando lo abran, podrán introducir su correo y recibirán su invitación personal.</p>
              <p><span className="font-semibold">Todo es anónimo:</span> nadie sabrá quién invitó a quién.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4">
              <p className="text-xs text-gray-500 mb-1 font-medium">Enlace de invitación</p>
              <p className="text-sm font-mono text-gray-700 break-all">{inviteLink}</p>
            </div>
            <CopyButton url={inviteLink} />
          </div>
        )}

        {/* Fase 2: Propuestas incrustadas */}
        {fase >= 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Propuestas e Ideas</h3>
            <PropuestasClient
              propuestasIniciales={propuestasConVotos}
              participanteId={participanteId}
              procesoId={procesoId}
              fase={fase}
              misPropostas={misPropostas}
              listoFase2={listoFase2}
              isAdminView={isAdminView}
              empresaNombre={procesoData.empresa.nombre}
              fase2FinalEn={fase2FinalEn}
            />
          </div>
        )}

        {/* Fase 3 */}
        {fase === 3 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selección de Representantes</h3>
            <p className="text-gray-600 mb-6">
              Se están seleccionando representantes. Puedes ofrecerte como voluntario o ser seleccionado por sorteo.
            </p>
            <button className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
              Ser Representante
            </button>
          </div>
        )}

        {/* Fase 4 */}
        {fase === 4 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fase de Diálogo</h3>
            <p className="text-gray-600 mb-6">
              Los representantes están dialogando con la dirección. Aquí aparecerán las respuestas.
            </p>
            <button className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
              Ver Resultados
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
