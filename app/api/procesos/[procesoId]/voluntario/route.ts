import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ procesoId: string }> }
) {
  const { procesoId } = await params;
  const body = await request.json();
  const { participante_id } = body;

  if (!participante_id) {
    return NextResponse.json({ error: 'Falta participante_id' }, { status: 400 });
  }

  // Verify participante belongs to this proceso
  const { data: participante, error: pError } = await supabaseAdmin
    .from('participantes')
    .select('id, proceso_id, es_voluntario')
    .eq('id', participante_id)
    .eq('proceso_id', procesoId)
    .single();

  if (!participante || pError) {
    return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 });
  }

  if (participante.es_voluntario) {
    return NextResponse.json({ ok: true, ya_registrado: true });
  }

  const { error: updateError } = await supabaseAdmin
    .from('participantes')
    .update({ es_voluntario: true })
    .eq('id', participante_id);

  if (updateError) {
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
