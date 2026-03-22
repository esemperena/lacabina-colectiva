import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ procesoId: string }> }
) {
  // Verify admin token
  const adminToken = request.cookies.get('admin_token')?.value;
  if (!adminToken) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data: tokenData } = await supabaseAdmin
    .from('admin_tokens')
    .select('id, created_at')
    .eq('token', adminToken)
    .single();

  if (!tokenData) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const tokenAge = Date.now() - new Date(tokenData.created_at).getTime();
  if (tokenAge > 86400 * 1000) {
    return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
  }

  const { procesoId } = await params;

  // Get current phase
  const { data: proceso, error: procesoError } = await supabaseAdmin
    .from('procesos')
    .select('id, fase')
    .eq('id', procesoId)
    .single();

  if (!proceso || procesoError) {
    return NextResponse.json({ error: 'Proceso no encontrado' }, { status: 404 });
  }

  const faseActual = Number(proceso.fase);

  if (faseActual >= 4) {
    return NextResponse.json({ error: 'El proceso ya está en la fase final' }, { status: 400 });
  }

  const nuevaFase = faseActual + 1;

  const updateData: Record<string, unknown> = { fase: nuevaFase };
  if (nuevaFase === 2) {
    updateData.fase2_inicio = new Date().toISOString();
  }

  const { error: updateError } = await supabaseAdmin
    .from('procesos')
    .update(updateData)
    .eq('id', procesoId);

  if (updateError) {
    return NextResponse.json({ error: 'Error al actualizar la fase' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, faseAnterior: faseActual, faseNueva: nuevaFase });
}
