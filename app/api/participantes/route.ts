import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generarToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { token, nombre, edad, sexo } = body;

    // Validate token
    if (!token) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 400 }
      );
    }

    // Look up invitacion
    const { data: invitacion, error: invitacionError } = await supabaseAdmin
      .from('invitaciones')
      .select('*')
      .eq('token', token)
      .eq('usado', false)
      .single();

    if (invitacionError || !invitacion) {
      console.error('Error finding invitacion:', invitacionError);
      return NextResponse.json(
        { error: 'Token inválido o ya utilizado' },
        { status: 400 }
      );
    }

    // Generate access token for participant
    const tokenAcceso = generarToken();

    // Insert participante
    const { data: participante, error: participanteError } = await supabaseAdmin
      .from('participantes')
      .insert({
        proceso_id: invitacion.proceso_id,
        email_hash: invitacion.email_hash,
        token_acceso: tokenAcceso,
        es_iniciador: false,
        es_rrhh: false,
        nombre: nombre || null,
        edad: edad || null,
        sexo: sexo || null,
      })
      .select()
      .single();

    if (participanteError || !participante) {
      console.error('Error creating participante:', participanteError);
      return NextResponse.json(
        { error: 'Failed to join proceso' },
        { status: 500 }
      );
    }

    // Mark invitacion as used
    const { error: updateError } = await supabaseAdmin
      .from('invitaciones')
      .update({ usado: true })
      .eq('id', invitacion.id);

    if (updateError) {
      console.error('Error marking invitacion as used:', updateError);
      // Don't fail the request, participante was already created
    }

    return NextResponse.json({
      success: true,
      participante_id: participante.id,
      proceso_id: participante.proceso_id,
      token_acceso: tokenAcceso,
      message: 'Participante joined successfully',
    });
  } catch (error) {
    console.error('Error joining proceso:', error);
    return NextResponse.json(
      { error: 'Failed to join proceso' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const procesoId = searchParams.get('proceso_id');

    if (!procesoId) {
      return NextResponse.json(
        { error: 'Proceso ID is required' },
        { status: 400 }
      );
    }

    // Count participantes for this proceso
    const { count, error } = await supabaseAdmin
      .from('participantes')
      .select('id', { count: 'exact' })
      .eq('proceso_id', procesoId);

    if (error) {
      console.error('Error counting participantes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch participantes count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      total: count || 0,
      proceso_id: procesoId,
    });
  } catch (error) {
    console.error('Error fetching participantes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participantes' },
      { status: 500 }
    );
  }
}
