import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export default async function AuthPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Validate token and get participante
  const { data: participante, error: participanteError } = await supabaseAdmin
    .from('participantes')
    .select('id, proceso_id')
    .eq('token_acceso', token)
    .single();

  if (!participante || participanteError) {
    // Invalid or expired token - redirect to login with error
    redirect('/login?error=invalid');
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 86400 * 7, // 7 days
    sameSite: 'lax',
  });

  // Redirect to dashboard
  redirect(`/dashboard/${participante.proceso_id}`);
}
