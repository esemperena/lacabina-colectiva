import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import PropuestasClient from './PropuestasClient';

export default async function PropuestasPage({
  params,
}: {
  params: Promise<{ procesoId: string }>;
}) {
  const { procesoId } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const adminToken = cookieStore.get('admin_token')?.value;

  let isAdminView = false;
  let participanteId = '';
  let misPropostas = 0;
  let listoFase2 = false;

  // Admin bypass
  if (adminToken) {
    const { data: tokenData } = await supabaseAdmin
      .from('admin_tokens')
      .select('id, created_at')
      .eq('token', adminToken)
      .single();
    if (tokenData) {
      const age = Date.now() - new Date(tokenData.created_at).getTime();
      if (age <= 86400 * 1000) isAdminView = true;
    }
  }

  // Employee auth
  if (!isAdminView) {
    if (!sessionToken) redirect('/login');
    const { data: participante } = await supabaseAdmin
      .from('participantes')
      .select('id, proceso_id, propuestas_enviadas, listo_fase2')
      .eq('token_acceso', sessionToken)
      .single();

    if (!participante || participante.proceso_id !== procesoId) redirect('/login');
    participanteId = participante.id;
    misPropostas = participante.propuestas_enviadas || 0;
    listoFase2 = participante.listo_fase2 || false;
  }

  // Fetch proceso
  const { data: proceso } = await supabaseAdmin
    .from('procesos')
    .select('id, fase, fase2_inicio, empresa:empresas(nombre)')
    .eq('id', procesoId)
    .single();

  if (!proceso) redirect('/login');

  const fase = Number(proceso.fase);
  const empresa = proceso.empresa as unknown as { nombre: string };

  // Fetch propuestas
  const { data: propuestasRaw } = await supabaseAdmin
    .from('propuestas')
    .select('id, titulo, descripcion, tipo, es_anonima, votos_count')
    .eq('proceso_id', procesoId)
    .order('votos_count', { ascending: false });

  // Fetch which propuestas the current participant has voted for
  let votedIds = new Set<string>();
  if (participanteId) {
    const { data: votos } = await supabaseAdmin
      .from('votos')
      .select('propuesta_id')
      .eq('participante_id', participanteId);
    if (votos) votedIds = new Set(votos.map(v => v.propuesta_id));
  }

  const propuestas = (propuestasRaw || []).map(p => ({
    ...p,
    has_voted: votedIds.has(p.id),
  }));

  // Calculate fase2 end date
  let fase2FinalEn: string | null = null;
  if (proceso.fase2_inicio) {
    const fin = new Date(new Date(proceso.fase2_inicio).getTime() + 14 * 24 * 60 * 60 * 1000);
    fase2FinalEn = fin.toISOString();
  }

  return (
    <PropuestasClient
      propuestasIniciales={propuestas}
      participanteId={participanteId}
      procesoId={procesoId}
      fase={fase}
      misPropostas={misPropostas}
      listoFase2={listoFase2}
      isAdminView={isAdminView}
      empresaNombre={empresa?.nombre || ''}
      fase2FinalEn={fase2FinalEn}
    />
  );
}
