import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ procesoId: string }> }
) {
  const { procesoId } = await params

  // Read cookie directly from the request object (more reliable in Route Handlers)
  const adminToken = request.cookies.get('admin_token')?.value

  if (!adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const { data: tokenData } = await supabaseAdmin
    .from('admin_tokens')
    .select('id, created_at')
    .eq('token', adminToken)
    .single()

  if (!tokenData) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const tokenAge = Date.now() - new Date(tokenData.created_at).getTime()
  if (tokenAge > 86400 * 1000) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Fetch fresh token_acceso for the initiator of this proceso
  const { data: iniciador } = await supabaseAdmin
    .from('participantes')
    .select('token_acceso, proceso_id')
    .eq('proceso_id', procesoId)
    .eq('es_iniciador', true)
    .single()

  if (!iniciador) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Set session_token and redirect to dashboard
  const response = NextResponse.redirect(
    new URL(`/dashboard/${procesoId}`, request.url)
  )
  response.cookies.set('session_token', iniciador.token_acceso, {
    httpOnly: true,
    path: '/',
    maxAge: 86400 * 7,
    sameSite: 'lax',
  })

  return response
}
