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

  const { aceptar } = await request.json();

  // Verify participante
  const { data: participante } = await supabaseAdmin
    .from('participantes')
    .select('id, proceso_id, estado_representante')
    .eq('token_acceso', sessionToken)
    .single();

  if (!participante || participante.proceso_id !== procesoId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (participante.estado_representante !== 'pendiente') {
    return NextResponse.json({ error: 'No tienes un cargo pendiente de aceptar' }, { status: 400 });
  }

  if (aceptar) {
    await supabaseAdmin
      .from('participantes')
      .update({ estado_representante: 'aceptado', es_representante: true })
      .eq('id', participante.id);

    return NextResponse.json({ ok: true, estado: 'aceptado' });
  } else {
    // Rechaza: mark as rejected, null out so they're not picked again
    await supabaseAdmin
      .from('participantes')
      .update({ estado_representante: 'rechazado' })
      .eq('id', participante.id);

    return NextResponse.json({ ok: true, estado: 'rechazado' });
  }
}
