import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const { data, error } = await supabaseAdmin
    .from('admin_tokens')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .single()

  if (!data || error || new Date(data.expires_at) < new Date()) {
    return NextResponse.redirect(new URL('/admin/login?error=invalid', request.url))
  }

  // Mark token as used
  await supabaseAdmin.from('admin_tokens').update({ used: true }).eq('id', data.id)

  const response = NextResponse.redirect(new URL('/admin', request.url))
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 86400, // 24 hours
    sameSite: 'lax',
  })

  return response
}
