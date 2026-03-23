import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generarToken } from '@/lib/utils'
import { Resend } from 'resend'

const ADMIN_EMAIL = 'esemperena4@gmail.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  // Security: always return success
  if (!email || email.toLowerCase().trim() !== ADMIN_EMAIL) {
    return NextResponse.json({ success: true })
  }

  const token = generarToken()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  await supabaseAdmin.from('admin_tokens').insert({
    token,
    used: false,
    expires_at: expiresAt.toISOString(),
  })

  const resend = new Resend(process.env.RESEND_API_KEY!)
  await resend.emails.send({
    from: 'hola@lacabinacolectiva.es',
    to: email,
    subject: 'Acceso admin — La Cabina Colectiva',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#4f46e5;">La Cabina Colectiva — Admin</h2>
      <p>Tu enlace de acceso al panel de administración:</p>
      <a href="${APP_URL}/api/admin/verify/${token}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:white;text-decoration:none;border-radius:8px;margin:16px 0;">
        Acceder al panel admin
      </a>
      <p style="color:#999;font-size:12px;">Válido durante 1 hora. Si no solicitaste este acceso, ignora este email.</p>
    </div>`,
  })

  return NextResponse.json({ success: true })
}
