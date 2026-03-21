import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

export async function GET(request: NextRequest) {
  // Verify admin session
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin_token')?.value

  if (!adminToken) {
    return NextResponse.json({ error: 'No admin token' }, { status: 401 })
  }

  const { data: tokenData } = await supabaseAdmin
    .from('admin_tokens')
    .select('id, created_at')
    .eq('token', adminToken)
    .single()

  if (!tokenData) {
    return NextResponse.json({ error: 'Invalid admin token' }, { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || process.env.URL || 'NOT SET'
  const targetEmail = request.nextUrl.searchParams.get('email') || 'no email provided'

  if (!apiKey) {
    return NextResponse.json({
      status: 'ERROR',
      problem: 'RESEND_API_KEY no está configurada en Netlify',
      app_url: appUrl,
    })
  }

  // Try sending a real test email
  const resend = new Resend(apiKey)
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: targetEmail,
      subject: '✅ Test email — La Cabina Colectiva',
      html: `<p>Este es un email de prueba enviado desde La Cabina Colectiva.</p><p>APP_URL: <code>${appUrl}</code></p><p>Si recibes esto, el sistema de emails funciona correctamente.</p>`,
    })

    return NextResponse.json({
      status: 'OK',
      resend_response: result,
      app_url: appUrl,
      api_key_prefix: apiKey.slice(0, 8) + '...',
      sent_to: targetEmail,
    })
  } catch (err: unknown) {
    return NextResponse.json({
      status: 'ERROR',
      error: err instanceof Error ? err.message : String(err),
      app_url: appUrl,
      api_key_prefix: apiKey.slice(0, 8) + '...',
    })
  }
}
