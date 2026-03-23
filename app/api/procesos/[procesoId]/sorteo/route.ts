import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { enviarEmailSorteoRepresentante } from '@/lib/email';

function calcularRepresentantesNecesarios(numEmpleados: number): number {
  if (numEmpleados < 6) return 0;
  if (numEmpleados <= 30) return 1;
  if (numEmpleados <= 49) return 3;
  if (numEmpleados <= 100) return 5;
  if (numEmpleados <= 250) return 9;
  if (numEmpleados <= 500) return 13;
  if (numEmpleados <= 750) return 17;
  if (numEmpleados <= 1000) return 21;
  return 21 + Math.ceil((numEmpleados - 1000) / 1000) * 3;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ procesoId: string }> }
) {
  const { procesoId } = await params;

  // Verify admin
  const adminToken = request.cookies.get('admin_token')?.value;
  if (!adminToken) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { data: tokenData } = await supabaseAdmin
    .from('admin_tokens').select('id, created_at').eq('token', adminToken).single();
  if (!tokenData || Date.now() - new Date(tokenData.created_at).getTime() > 86400 * 1000) {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 });
  }

  // Get proceso + empresa
  const { data: proceso } = await supabaseAdmin
    .from('procesos')
    .select('id, fase, empleados_objetivo, empresa:empresas(nombre, num_empleados)')
    .eq('id', procesoId).single();
  if (!proceso || proceso.fase !== '3') {
    return NextResponse.json({ error: 'El proceso no está en Fase 3' }, { status: 400 });
  }

  const empresa = proceso.empresa as unknown as { nombre: string; num_empleados: number };
  const totalEmpleados = Number(empresa?.num_empleados) || Number(proceso.empleados_objetivo) || 0;
  const necesarios = calcularRepresentantesNecesarios(totalEmpleados);

  // Count already confirmed representatives
  const { count: yaConfirmados } = await supabaseAdmin
    .from('participantes').select('id', { count: 'exact', head: true })
    .eq('proceso_id', procesoId).eq('es_representante', true).eq('estado_representante', 'aceptado');
  const confirmados = yaConfirmados || 0;

  // Count pending (already sorted, waiting response)
  const { count: yaPendientes } = await supabaseAdmin
    .from('participantes').select('id', { count: 'exact', head: true })
    .eq('proceso_id', procesoId).eq('estado_representante', 'pendiente');
  const pendientes = yaPendientes || 0;

  const faltantes = necesarios - confirmados - pendientes;
  if (faltantes <= 0) {
    return NextResponse.json({ ok: true, message: 'Ya hay suficientes representantes o candidatos pendientes' });
  }

  // Get eligible participants (not already representative, not rejected, not pending)
  const { data: elegibles } = await supabaseAdmin
    .from('participantes')
    .select('id, email_contacto, token_acceso')
    .eq('proceso_id', procesoId)
    .is('estado_representante', null);

  if (!elegibles || elegibles.length === 0) {
    return NextResponse.json({ error: 'No hay participantes elegibles para el sorteo' }, { status: 400 });
  }

  // Shuffle and pick
  const shuffled = elegibles.sort(() => Math.random() - 0.5);
  const seleccionados = shuffled.slice(0, faltantes);

  const nombreEmpresa = empresa?.nombre || 'tu empresa';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://astounding-kashata-8c4839.netlify.app';

  for (const p of seleccionados) {
    // Mark as pending
    await supabaseAdmin
      .from('participantes')
      .update({ estado_representante: 'pendiente' })
      .eq('id', p.id);

    // Send email
    if (p.email_contacto) {
      try {
        const enlace = `${APP_URL}/api/auth/verify/${p.token_acceso}`;
        await enviarEmailSorteoRepresentante(p.email_contacto, p.token_acceso, enlace, nombreEmpresa);
      } catch (e) {
        console.error('Error sending sorteo email:', e);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    sorteados: seleccionados.length,
    necesarios,
    confirmados,
    pendientes: pendientes + seleccionados.length,
  });
}
