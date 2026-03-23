import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://lacabinacolectiva.es'

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
    console.error('Auth verify: token not found', { token: token.substring(0, 8) + '...', error })
    return NextResponse.redirect(new URL('/login?error=invalid', APP_URL))
  }

  const response = NextResponse.redirect(
    new URL(`/dashboard/${participante.proceso_id}`, APP_URL)
  )

  response.cookies.set('session_token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 86400 * 7, // 7 days
    sameSite: 'lax',
    secure: true,
  })

  return response
}
