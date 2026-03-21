import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { enviarEmailAnuncioRRHH } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { token, contenido } = await request.json();

    if (!token || !contenido?.trim()) {
      return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 });
    }

    // Verify RRHH token
    const { data: proceso } = await supabaseAdmin
      .from('procesos')
      .select('id, empresa:empresas(nombre)')
      .eq('token_rrhh', token)
      .single();

    if (!proceso) {
      return NextResponse.json({ error: 'Token no válido.' }, { status: 401 });
    }

    const empresa = proceso.empresa as unknown as { nombre: string };

    // Insert announcement
    const { data: anuncio, error: insertError } = await supabaseAdmin
      .from('anuncios')
      .insert({ proceso_id: proceso.id, contenido: contenido.trim() })
      .select()
      .single();

    if (insertError || !anuncio) {
      console.error('Error inserting anuncio:', insertError);
      return NextResponse.json({ error: 'Error al publicar el anuncio.' }, { status: 500 });
    }

    // Send email notification to all participants with email_contacto
    const { data: participantes } = await supabaseAdmin
      .from('participantes')
      .select('email_contacto, token_acceso')
      .eq('proceso_id', proceso.id)
      .not('email_contacto', 'is', null);

    let enviados = 0;
    for (const p of participantes || []) {
      if (p.email_contacto && p.token_acceso) {
        try {
          await enviarEmailAnuncioRRHH(
            p.email_contacto,
            p.token_acceso,
            empresa.nombre,
            contenido.trim()
          );
          enviados++;
        } catch (e) {
          console.error('Error sending anuncio email to', p.email_contacto, e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      anuncio,
      emailsEnviados: enviados,
    });
  } catch (error) {
    console.error('Error in anuncios route:', error);
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 });
  }
}
