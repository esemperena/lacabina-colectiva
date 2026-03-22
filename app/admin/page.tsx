import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import AvanzarFaseButton from './AvanzarFaseButton'

export default async function AdminPage() {
  // Auth check
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin_token')?.value

  if (!adminToken) {
    redirect('/admin/login')
  }

  // Verify admin token exists and was created within the last 24 hours
  const { data: tokenData } = await supabaseAdmin
    .from('admin_tokens')
    .select('id, created_at')
    .eq('token', adminToken)
    .single()

  if (!tokenData) {
    redirect('/admin/login')
  }

  const tokenAge = Date.now() - new Date(tokenData.created_at).getTime()
  if (tokenAge > 86400 * 1000) {
    redirect('/admin/login')
  }

  // Fetch all processes with empresa info
  const { data: procesos } = await supabaseAdmin
    .from('procesos')
    .select('*, empresa:empresas(*)')
    .order('created_at', { ascending: false })

  const lista = procesos || []

  const faseLabelMap: Record<string, string> = {
    '1': 'Fase 1 — Invitaciones',
    '2': 'Fase 2 — Propuestas',
    '3': 'Fase 3 — Representantes',
    '4': 'Fase 4 — Diálogo',
  }

  const faseColorMap: Record<string, string> = {
    '1': 'bg-blue-100 text-blue-800',
    '2': 'bg-yellow-100 text-yellow-800',
    '3': 'bg-purple-100 text-purple-800',
    '4': 'bg-green-100 text-green-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">La Cabina Colectiva</h1>
              <p className="text-sm text-gray-500">Panel de Administración</p>
            </div>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Volver a la web</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Procesos activos</h2>
            <p className="text-gray-500 mt-1">{lista.length} proceso{lista.length !== 1 ? 's' : ''} en total</p>
          </div>
        </div>

        {lista.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            <p className="text-lg">No hay procesos todavía.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lista.map((proceso: any) => {
              const empresa = proceso.empresa as { nombre: string; sector: string; num_empleados: number; rrhh_email: string }
              const porcentaje = proceso.empleados_objetivo > 0
                ? Math.round((proceso.empleados_unidos / proceso.empleados_objetivo) * 100)
                : 0

              return (
                <div key={proceso.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{empresa?.nombre}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${faseColorMap[proceso.fase] || 'bg-gray-100 text-gray-700'}`}>
                          {faseLabelMap[proceso.fase] || `Fase ${proceso.fase}`}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Sector: <strong className="text-gray-700">{empresa?.sector}</strong></span>
                        <span>Empleados: <strong className="text-gray-700">{proceso.empleados_unidos} / {proceso.empleados_objetivo}</strong> ({porcentaje}%)</span>
                        <span>RRHH: <strong className="text-gray-700">{empresa?.rrhh_email}</strong></span>
                        <span>Creado: <strong className="text-gray-700">{new Date(proceso.created_at).toLocaleDateString('es-ES')}</strong></span>
                      </div>

                      <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${Math.min(porcentaje, 100)}%` }} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <a
                        href={`/rrhh/${proceso.token_rrhh}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
                      >
                        Panel RRHH →
                      </a>
                      <a
                        href={`/dashboard/${proceso.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
                      >
                        Dashboard Empleados →
                      </a>
                      <AvanzarFaseButton
                        procesoId={proceso.id}
                        faseActual={Number(proceso.fase)}
                        empresaNombre={empresa?.nombre}
                      />
                      <span className="text-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
                        ID: <code className="text-xs">{proceso.id.slice(0, 8)}…</code>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
