import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const { data: participante, error } = await supabaseAdmin
    .from('participantes')
    .select('id, proceso_id')
    .eq('token_acceso', token)
    .single()

  if (!participante || error) {
    return NextResponse.redirect(new URL('/login?error=invalid', request.url))
  }

  const response = NextResponse.redirect(
    new URL(`/dashboard/${participante.proceso_id}`, request.url)
  )

  response.cookies.set('session_token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 86400 * 7, // 7 days
    sameSite: 'lax',
  })

  return response
}
