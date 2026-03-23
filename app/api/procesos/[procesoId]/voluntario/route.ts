import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ procesoId: string }> }
) {
  const { procesoId } = await params;
  const body = await request.json();
  const { participante_id, accion } = body;
  // accion: 'voluntario' | 'revertir' | 'declinar'

  if (!participante_id || !accion) {
    return NextResponse.json({ error: 'Faltan campos (participante_id, accion)' }, { status: 400 });
  }

  // Verificar que el proceso está en Fase 3 subfase candidatura
  const { data: proc } = await supabaseAdmin
    .from('procesos')
    .select('fase, fase3_subfase')
    .eq('id', procesoId)
    .single();

  if (!proc || proc.fase !== '3' || (proc.fase3_subfase && proc.fase3_subfase !== 'candidatura')) {
    return NextResponse.json({ error: 'El periodo de candidaturas ha terminado' }, { status: 400 });
  }

  // Verificar participante pertenece al proceso
  const { data: participante, error: pError } = await supabaseAdmin
    .from('participantes')
    .select('id, proceso_id, es_voluntario, declina_representante')
    .eq('id', participante_id)
    .eq('proceso_id', procesoId)
    .single();

  if (!participante || pError) {
    return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 });
  }

  if (accion === 'voluntario') {
    await supabaseAdmin.from('participantes')
      .update({ es_voluntario: true, declina_representante: false })
      .eq('id', participante_id);
    return NextResponse.json({ ok: true, es_voluntario: true, declina_representante: false });
  }

  if (accion === 'revertir') {
    await supabaseAdmin.from('participantes')
      .update({ es_voluntario: false, declina_representante: false })
      .eq('id', participante_id);
    return NextResponse.json({ ok: true, es_voluntario: false, declina_representante: false });
  }

  if (accion === 'declinar') {
    await supabaseAdmin.from('participantes')
      .update({ es_voluntario: false, declina_representante: true })
      .eq('id', participante_id);
    return NextResponse.json({ ok: true, es_voluntario: false, declina_representante: true });
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
}
