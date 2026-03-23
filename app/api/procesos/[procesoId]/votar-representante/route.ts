import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ procesoId: string }> }
) {
  const { procesoId } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { candidato_id } = await request.json();

  // Verify votante
  const { data: votante } = await supabaseAdmin
    .from('participantes')
    .select('id, proceso_id')
    .eq('token_acceso', sessionToken)
    .single();

  if (!votante || votante.proceso_id !== procesoId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Verify candidato is a volunteer in same proceso
  const { data: candidato } = await supabaseAdmin
    .from('participantes')
    .select('id, proceso_id, es_voluntario')
    .eq('id', candidato_id)
    .eq('proceso_id', procesoId)
    .eq('es_voluntario', true)
    .single();

  if (!candidato) {
    return NextResponse.json({ error: 'Candidato no válido' }, { status: 400 });
  }

  // Toggle vote (insert or delete)
  const { data: existingVote } = await supabaseAdmin
    .from('votos_representantes')
    .select('id')
    .eq('votante_id', votante.id)
    .eq('candidato_id', candidato_id)
    .single();

  if (existingVote) {
    await supabaseAdmin.from('votos_representantes').delete().eq('id', existingVote.id);
    return NextResponse.json({ ok: true, voted: false });
  } else {
    await supabaseAdmin.from('votos_representantes').insert({
      proceso_id: procesoId,
      votante_id: votante.id,
      candidato_id: candidato_id,
    });
    return NextResponse.json({ ok: true, voted: true });
  }
}
