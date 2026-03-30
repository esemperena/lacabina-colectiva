import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { enviarRecordatorioInvitacion } from '@/lib/email'

// Protegido con CRON_SECRET para que solo lo llame el servicio externo
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const DIAS_RECORDATORIO = 3
  const hace3Dias = new Date(Date.now() - DIAS_RECORDATORIO * 24 * 60 * 60 * 1000).toISOString()

  // Invitaciones no usadas, creadas hace más de 3 días, sin recordatorio enviado aún
  const { data: invitaciones, error } = await supabaseAdmin
    .from('invitaciones')
    .select('id, token, email, proceso_id, created_at')
    .eq('usado', false)
    .lt('created_at', hace3Dias)
    .is('ultimo_recordatorio', null)
    .not('email', 'is', null)

  if (error) {
    console.error('Error fetching invitaciones:', error)
    return NextResponse.json({ error: 'Error al obtener invitaciones' }, { status: 500 })
  }

  let enviados = 0
  let errores = 0

  for (const inv of invitaciones || []) {
    // Verificar que el proceso sigue en Fase 1
    const { data: proceso } = await supabaseAdmin
      .from('procesos')
      .select('fase, empresa:empresas(nombre)')
      .eq('id', inv.proceso_id)
      .single()

    if (!proceso || proceso.fase !== '1') continue

    const empresa = proceso.empresa as unknown as { nombre: string }
    const nombreEmpresa = empresa?.nombre || 'tu empresa'

    try {
      await enviarRecordatorioInvitacion(inv.email, inv.token, nombreEmpresa)
      await supabaseAdmin
        .from('invitaciones')
        .update({ ultimo_recordatorio: new Date().toISOString() })
        .eq('id', inv.id)
      enviados++
    } catch (e) {
      console.error('Error sending reminder to', inv.email, e)
      errores++
    }
  }

  return NextResponse.json({ ok: true, enviados, errores })
}
