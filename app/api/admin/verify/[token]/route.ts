import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://lacabinacolectiva.es'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  if (!token || token.length < 10) {
    return NextResponse.redirect(new URL('/admin/login?error=invalid', APP_URL))
  }

  // First: find the token regardless of used status
  const { data, error } = await supabaseAdmin
    .from('admin_tokens')
    .select('*')
    .eq('token', token)
    .single()

  if (error || !data) {
    console.error('Admin verify: token not found', { token: token.substring(0, 8) + '...', error })
    return NextResponse.redirect(new URL('/admin/login?error=invalid', APP_URL))
  }

  // Check if already used
  if (data.used) {
    console.error('Admin verify: token already used')
    return NextResponse.redirect(new URL('/admin/login?error=used', APP_URL))
  }

  // Check if expired
  if (new Date(data.expires_at) < new Date()) {
    console.error('Admin verify: token expired')
    return NextResponse.redirect(new URL('/admin/login?error=expired', APP_URL))
  }

  // Mark token as used
  await supabaseAdmin.from('admin_tokens').update({ used: true }).eq('id', data.id)

  const response = NextResponse.redirect(new URL('/admin', APP_URL))
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 86400, // 24 hours
    sameSite: 'lax',
    secure: true,
  })

  return response
}
