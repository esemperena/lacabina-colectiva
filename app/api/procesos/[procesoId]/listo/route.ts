import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { enviarEmailInicioFase3 } from '@/lib/email';

async function intentarTransicionFase3(procesoId: string) {
  const { data: proceso } = await supabaseAdmin
    .from('procesos')
    .select('id, fase, fase2_inicio, empresa:empresas(nombre)')
    .eq('id', procesoId)
    .single()

  if (!proceso || proceso.fase !== '2') return

  // Check conditions: all participants ready OR 2 weeks have passed
  const { data: participantes } = await supabaseAdmin
    .from('participantes')
    .select('id, listo_fase2, token_acceso, email_contacto')
    .eq('proceso_id', procesoId)

  if (!participantes || participantes.length === 0) return

  const todosListos = participantes.every(p => p.listo_fase2 === true)
  const dosSemanasMs = 14 * 24 * 60 * 60 * 1000
  const dosSemanasPasadas = proceso.fase2_inicio
    ? Date.now() - new Date(proceso.fase2_inicio).getTime() > dosSemanasMs
    : false

  if (!todosListos && !dosSemanasPasadas) return

  // Transition to fase 3
  await supabaseAdmin.from('procesos').update({ fase: '3' }).eq('id', procesoId)

  // Send emails to all participants with email_contacto
  const empresa = proceso.empresa as unknown as { nombre: string }
  const nombreEmpresa = empresa?.nombre || 'tu empresa'

  for (const p of participantes) {
    if (!p.email_contacto) continue
    try {
      await enviarEmailInicioFase3(p.email_contacto, p.token_acceso, nombreEmpresa)
    } catch (e) {
      console.error('Error sending fase3 email to', p.email_contacto, e)
    }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ procesoId: string }> }
) {
  try {
    const { procesoId } = await params
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verify participante
    const { data: participante } = await supabaseAdmin
      .from('participantes')
      .select('id, proceso_id, listo_fase2')
      .eq('token_acceso', sessionToken)
      .single()

    if (!participante || participante.proceso_id !== procesoId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (participante.listo_fase2) {
      return NextResponse.json({ ok: true, yaListo: true })
    }

    // Mark as listo
    await supabaseAdmin
      .from('participantes')
      .update({ listo_fase2: true })
      .eq('id', participante.id)

    // Check phase 2→3 transition (async, non-blocking)
    intentarTransicionFase3(procesoId).catch(e =>
      console.error('Error en transición fase 2→3:', e)
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Error en /listo:', e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
