import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { verificarSubfaseFase3, calcularRepresentantesNecesarios } from '@/lib/fase3';
import CopyButton from './CopyButton';
import PropuestasClient from './propuestas/PropuestasClient';
import RepresentanteSection from './RepresentanteSection';
import { LogoLink } from '@/components/Logo';

type Fase = 1 | 2 | 3 | 4;

interface Anuncio { id: string; contenido: string; created_at: string; }

function AnunciosBoard({ anuncios }: { anuncios: Anuncio[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📢</span>
        <h3 className="text-base font-semibold text-gray-900">Tablón de RRHH</h3>
      </div>
      {anuncios.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Aún no hay anuncios publicados por RRHH.</p>
      ) : (
        <div className="space-y-4">
          {anuncios.map(a => (
            <div key={a.id} className="border-l-4 border-teal-400 pl-4">
              <p className="text-sm text-gray-800 whitespace-pre-wrap mb-1">{a.contenido}</p>
              <p className="text-xs text-gray-400">
                {new Date(a.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
  let esVoluntario = false;
  let declinaRepresentante = false;
  let nombreEmpleado: string | null = null;
  let estadoRepresentante: string | null = null;

  if (adminToken) {
    const { data: tokenData } = await supabaseAdmin
      .from('admin_tokens').select('id, created_at').eq('token', adminToken).single();
    if (tokenData) {
      const tokenAge = Date.now() - new Date(tokenData.created_at).getTime();
      if (tokenAge <= 86400 * 1000) isAdminView = true;
    }
  }

  if (isAdminView) {
    const { data: iniciador } = await supabaseAdmin
      .from('participantes')
      .select('id, propuestas_enviadas, listo_fase2, es_voluntario, declina_representante, estado_representante')
      .eq('proceso_id', procesoId).eq('es_iniciador', true).single();
    if (iniciador) {
      participanteId = iniciador.id;
      misPropostas = iniciador.propuestas_enviadas || 0;
      listoFase2 = iniciador.listo_fase2 || false;
      esVoluntario = iniciador.es_voluntario || false;
      declinaRepresentante = iniciador.declina_representante || false;
      estadoRepresentante = iniciador.estado_representante || null;
    }
  }

  if (!isAdminView) {
    if (!sessionToken) redirect('/login');
    const { data: participante, error: participanteError } = await supabaseAdmin
      .from('participantes')
      .select('id, proceso_id, nombre, apellidos, es_iniciador, propuestas_enviadas, listo_fase2, es_voluntario, declina_representante, estado_representante')
      .eq('token_acceso', sessionToken).single();
    if (!participante || participanteError || participante.proceso_id !== procesoId) redirect('/login');
    participanteId = participante.id;
    misPropostas = participante.propuestas_enviadas || 0;
    listoFase2 = participante.listo_fase2 || false;
    esVoluntario = participante.es_voluntario || false;
    declinaRepresentante = participante.declina_representante || false;
    estadoRepresentante = participante.estado_representante || null;
    const nombre = participante.nombre || '';
    const apellidos = participante.apellidos || '';
    nombreEmpleado = [nombre, apellidos].filter(Boolean).join(' ') || null;
  }

  const { data: proceso, error: procesoError } = await supabaseAdmin
    .from('procesos')
    .select('id, fase, estado, empleados_unidos, empleados_objetivo, fase2_inicio, empresa:empresas(id, nombre, sector, num_empleados, rrhh_email)')
    .eq('id', procesoId).single();
  if (!proceso || procesoError) redirect('/login');

  interface ProcesoData {
    id: string; fase: string; estado: string;
    empleados_unidos: number; empleados_objetivo: number;
    fase2_inicio?: string | null;
    empresa: { id: string; nombre: string; sector: string; num_empleados: number; rrhh_email: string; };
  }

  const procesoData = proceso as unknown as ProcesoData;

  // Auto-avance Fase 2→3: si pasaron 14 días desde fase2_inicio
  if (procesoData.fase === '2' && procesoData.fase2_inicio) {
    const dosSemanasMs = 14 * 24 * 60 * 60 * 1000;
    const tiempoPasado = Date.now() - new Date(procesoData.fase2_inicio).getTime();
    if (tiempoPasado > dosSemanasMs) {
      await supabaseAdmin.from('procesos').update({ fase: '3', fase3_inicio: new Date().toISOString(), fase3_subfase: 'candidatura' }).eq('id', procesoId);
      procesoData.fase = '3';
    }
  }

  const fase = Number(procesoData.fase) as Fase;
  const porcentaje = Math.round((procesoData.empleados_unidos / procesoData.empleados_objetivo) * 100);
  const umbralProceso = Math.ceil(procesoData.empleados_objetivo * 0.1);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://lacabinacolectiva.es';
  const inviteLink = `${APP_URL}/invitar/${procesoId}`;

  // Calcular representantes necesarios según la ley (ET art. 62-66)
  // Fuentes: empresa.num_empleados → empleados_objetivo → query directa a empresas
  let totalEmpleados = Number(procesoData.empresa?.num_empleados) || Number(procesoData.empleados_objetivo) || 0;
  if (totalEmpleados === 0 && procesoData.empresa?.id) {
    // Último recurso: re-query directo a la tabla empresas
    const { data: emp } = await supabaseAdmin.from('empresas').select('num_empleados').eq('id', procesoData.empresa.id).single();
    totalEmpleados = Number(emp?.num_empleados) || 0;
  }
  const representantesNecesarios = calcularRepresentantesNecesarios(totalEmpleados);
  let voluntariosActuales = 0;
  let representantesConfirmados = 0;
  let totalParticipantes = 0;
  let hanDecididoCount = 0;
  let subfase = 'candidatura';
  let diasRestantes = 14;
  let candidatos: Array<{ id: string; nombre: string | null; votos_count: number; has_voted: boolean }> = [];

  if (fase === 3) {
    // Verificar y avanzar subfase automáticamente
    subfase = await verificarSubfaseFase3(procesoId);

    // Contar voluntarios
    try {
      const { count } = await supabaseAdmin
        .from('participantes').select('id', { count: 'exact', head: true })
        .eq('proceso_id', procesoId).eq('es_voluntario', true);
      voluntariosActuales = count || 0;
    } catch { /* */ }

    // Contar representantes confirmados
    try {
      const { count: confCount } = await supabaseAdmin
        .from('participantes').select('id', { count: 'exact', head: true })
        .eq('proceso_id', procesoId).eq('es_representante', true).eq('estado_representante', 'aceptado');
      representantesConfirmados = confCount || 0;
    } catch { /* */ }

    // Total participantes y cuántos han decidido
    try {
      const { count: totalCount } = await supabaseAdmin
        .from('participantes').select('id', { count: 'exact', head: true })
        .eq('proceso_id', procesoId);
      totalParticipantes = totalCount || 0;

      const { count: decididos } = await supabaseAdmin
        .from('participantes').select('id', { count: 'exact', head: true })
        .eq('proceso_id', procesoId)
        .or('es_voluntario.eq.true,declina_representante.eq.true');
      hanDecididoCount = decididos || 0;
    } catch { /* */ }

    // Días restantes de candidatura
    const { data: procFase3 } = await supabaseAdmin
      .from('procesos').select('fase3_inicio').eq('id', procesoId).single();
    if (procFase3?.fase3_inicio) {
      const inicio = new Date(procFase3.fase3_inicio);
      const diasPasados = (Date.now() - inicio.getTime()) / (1000 * 60 * 60 * 24);
      diasRestantes = Math.max(0, Math.ceil(14 - diasPasados));
    }

    // Si votación, obtener candidatos con votos
    if (subfase === 'votacion') {
      try {
        const { data: voluntarios } = await supabaseAdmin
          .from('participantes').select('id, nombre')
          .eq('proceso_id', procesoId).eq('es_voluntario', true);

        if (voluntarios) {
          let votedByMe = new Set<string>();
          if (participanteId) {
            const { data: misVotos } = await supabaseAdmin
              .from('votos_representantes').select('candidato_id')
              .eq('votante_id', participanteId);
            if (misVotos) votedByMe = new Set(misVotos.map(v => v.candidato_id));
          }

          candidatos = await Promise.all(voluntarios.map(async (v) => {
            const { count } = await supabaseAdmin
              .from('votos_representantes').select('id', { count: 'exact', head: true })
              .eq('candidato_id', v.id);
            return {
              id: v.id, nombre: v.nombre,
              votos_count: count || 0, has_voted: votedByMe.has(v.id),
            };
          }));
        }
      } catch { /* */ }
    }

    // Si verificarSubfaseFase3 devolvió 'completada', la fase ya es 4
    if (subfase === 'completada') {
      // Reload — the function already updated the DB
    }
  }

  const { data: anunciosData } = await supabaseAdmin
    .from('anuncios').select('id, contenido, created_at')
    .eq('proceso_id', procesoId).order('created_at', { ascending: false });
  const anuncios = anunciosData || [];

  let propuestasConVotos: Array<{
    id: string; titulo: string; descripcion: string;
    tipo: 'propuesta' | 'queja' | 'consulta' | 'sugerencia';
    es_anonima: boolean; votos_count: number; has_voted: boolean;
  }> = [];
  let fase2FinalEn: string | null = null;

  if (fase >= 2) {
    const { data: propuestasRaw } = await supabaseAdmin
      .from('propuestas').select('id, titulo, descripcion, tipo, es_anonima, votos_count')
      .eq('proceso_id', procesoId).order('votos_count', { ascending: false });

    let votedIds = new Set<string>();
    if (participanteId) {
      const { data: votos } = await supabaseAdmin
        .from('votos').select('propuesta_id').eq('participante_id', participanteId);
      if (votos) votedIds = new Set(votos.map(v => v.propuesta_id));
    }
    propuestasConVotos = (propuestasRaw || []).map(p => ({ ...p, has_voted: votedIds.has(p.id) }));

    if (procesoData.fase2_inicio) {
      const fin = new Date(new Date(procesoData.fase2_inicio).getTime() + 14 * 24 * 60 * 60 * 1000);
      fase2FinalEn = fin.toISOString();
    }
  }

  const phaseLabels = ['Invitaciones', 'Propuestas', 'Representantes', 'Diálogo'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <LogoLink />
          {isAdminView && (
            <Link href="/admin" className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
              ← Panel admin
            </Link>
          )}
        </div>
      </header>

      {isAdminView && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <p className="text-sm text-amber-800 font-medium">👁 Vista administrador — los empleados ven esta misma pantalla.</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Compact header */}
        <div>
          <p className="text-sm text-gray-500">{procesoData.empresa.nombre}</p>
          <h2 className="text-2xl font-bold text-gray-900">Tu proceso colectivo</h2>
        </div>

        {/* Timeline card (compact) + participation bar */}
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
          {/* Participation bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-700">
                Participación: <span className="text-teal-600">{procesoData.empleados_unidos}</span>
                <span className="text-gray-400"> / {procesoData.empleados_objetivo} empleados</span>
              </span>
              <span className="text-sm font-bold text-teal-600">{porcentaje}%</span>
            </div>
            <div className="relative bg-gray-100 rounded-full h-3 overflow-visible">
              {/* Progreso actual */}
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(porcentaje, 100)}%` }}
              />
              {/* Marcador del umbral mínimo */}
              {fase === 1 && umbralProceso < procesoData.empleados_objetivo && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${Math.round((umbralProceso / procesoData.empleados_objetivo) * 100)}%` }}
                >
                  <div className="w-0.5 h-4 bg-amber-500 rounded" />
                </div>
              )}
            </div>
            {fase === 1 && (
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-gray-400">0</span>
                <span
                  className="text-xs text-amber-600 font-medium"
                  style={{ marginLeft: `calc(${Math.round((umbralProceso / procesoData.empleados_objetivo) * 100)}% - 2rem)` }}
                >
                  mínimo: {umbralProceso}
                </span>
              </div>
            )}
          </div>

          {/* Thin horizontal timeline */}
          <div className="relative flex items-center justify-between">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 mx-4" />
            {/* Progress fill */}
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

        {/* === ACTIVE PHASE SECTION (purple) — always right below timeline === */}

        {/* Fase 1 active section */}
        {fase === 1 && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">Fase activa</span>
              <h3 className="text-lg font-bold text-purple-900">Invita a más compañeros</h3>
            </div>
            <p className="text-sm text-purple-700 mb-5">El proceso necesita al menos el 10% de participación para avanzar. Comparte el enlace — nadie sabrá que fuiste tú.</p>

            {/* Participation notice inside this section */}
            {procesoData.empleados_unidos >= umbralProceso ? (
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4 text-sm text-green-800 font-semibold">
                ✅ ¡Umbral alcanzado! El proceso avanzará a la Fase 2 en breve.
              </div>
            ) : (
              <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 mb-4 text-sm text-purple-800">
                Faltan <strong>{umbralProceso - procesoData.empleados_unidos}</strong> empleados más para alcanzar el umbral ({umbralProceso} en total, {Math.round((umbralProceso / procesoData.empleados_objetivo) * 100)}%).
              </div>
            )}

            <div className="bg-white border border-purple-200 rounded-lg px-4 py-3 mb-3">
              <p className="text-xs text-gray-500 mb-1 font-medium">Enlace de invitación</p>
              <p className="text-sm font-mono text-gray-700 break-all">{inviteLink}</p>
            </div>
            <CopyButton url={inviteLink} />
          </div>
        )}

        {/* Fase 2 active section */}
        {fase === 2 && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">Fase activa</span>
              <h3 className="text-lg font-bold text-purple-900">Propuestas e ideas</h3>
            </div>
            <p className="text-sm text-purple-700 mb-5">Comparte tus ideas, quejas o propuestas de mejora. Puedes hacerlo de forma anónima. Vota las que más te importan.</p>
            <PropuestasClient
              propuestasIniciales={propuestasConVotos}
              participanteId={participanteId}
              procesoId={procesoId}
              fase={fase}
              misPropostas={misPropostas}
              listoFase2={listoFase2}
              isAdminView={false}
              empresaNombre={procesoData.empresa.nombre}
              fase2FinalEn={fase2FinalEn}
              nombreEmpleado={nombreEmpleado}
            />
          </div>
        )}

        {/* Fase 3 active section */}
        {fase === 3 && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">Fase activa</span>
              <h3 className="text-lg font-bold text-purple-900">Selección de Representantes</h3>
            </div>
            <p className="text-sm text-purple-700 mb-5">Los representantes elegidos llevarán las propuestas a la dirección de la empresa.</p>
            <RepresentanteSection
              procesoId={procesoId}
              participanteId={participanteId}
              subfase={subfase}
              esVoluntario={esVoluntario}
              declinaRepresentante={declinaRepresentante}
              voluntariosActuales={voluntariosActuales}
              representantesNecesarios={representantesNecesarios}
              totalParticipantes={totalParticipantes}
              hanDecidido={hanDecididoCount}
              estadoRepresentante={estadoRepresentante}
              candidatos={candidatos}
              representantesConfirmados={representantesConfirmados}
              diasRestantes={diasRestantes}
            />
          </div>
        )}

        {/* Fase 4: proceso cerrado, modo consulta */}
        {fase === 4 && (
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">Proceso completado</span>
              <h3 className="text-lg font-bold text-green-900">Fase de Diálogo</h3>
            </div>
            <p className="text-sm text-green-700 mb-3">Los representantes elegidos están dialogando con la dirección de la empresa para trasladar las propuestas más votadas.</p>
            <p className="text-xs text-green-600">Este proceso está ahora en modo consulta. Puedes revisar las propuestas pero ya no se pueden enviar nuevas ni votar.</p>
          </div>
        )}

        {/* Fase 3: proposals (read-only, below active section) */}
        {fase === 3 && propuestasConVotos.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Propuestas de la Fase 2</h3>
            <PropuestasClient
              propuestasIniciales={propuestasConVotos}
              participanteId={participanteId}
              procesoId={procesoId}
              fase={fase}
              misPropostas={misPropostas}
              listoFase2={listoFase2}
              isAdminView={false}
              empresaNombre={procesoData.empresa.nombre}
              fase2FinalEn={fase2FinalEn}
              nombreEmpleado={nombreEmpleado}
            />
          </div>
        )}

        {/* Fase 4: proposals (read-only) */}
        {fase === 4 && propuestasConVotos.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Propuestas presentadas</h3>
            <PropuestasClient
              propuestasIniciales={propuestasConVotos}
              participanteId={participanteId}
              procesoId={procesoId}
              fase={fase}
              misPropostas={misPropostas}
              listoFase2={listoFase2}
              isAdminView={false}
              empresaNombre={procesoData.empresa.nombre}
              fase2FinalEn={fase2FinalEn}
              nombreEmpleado={nombreEmpleado}
            />
          </div>
        )}

        {/* Announcements (all phases) */}
        <AnunciosBoard anuncios={anuncios} />

      </div>
    </div>
  );
}
