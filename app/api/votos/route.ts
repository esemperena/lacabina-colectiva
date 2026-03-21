import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { propuesta_id, participante_id } = body;

    // Validate required fields
    if (!propuesta_id || !participante_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if vote already exists
    const { data: existingVoto, error: checkError } = await supabaseAdmin
      .from('votos')
      .select('id')
      .eq('propuesta_id', propuesta_id)
      .eq('participante_id', participante_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is expected
      console.error('Error checking existing vote:', checkError);
      return NextResponse.json(
        { error: 'Failed to check vote status' },
        { status: 500 }
      );
    }

    // If vote exists, delete it (toggle off)
    if (existingVoto) {
      const { error: deleteError } = await supabaseAdmin
        .from('votos')
        .delete()
        .eq('id', existingVoto.id);

      if (deleteError) {
        console.error('Error deleting vote:', deleteError);
        return NextResponse.json(
          { error: 'Failed to remove vote' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        voted: false,
        message: 'Vote removed',
      });
    }

    // If vote doesn't exist, insert new one
    const { error: insertError } = await supabaseAdmin
      .from('votos')
      .insert({
        propuesta_id,
        participante_id,
      });

    if (insertError) {
      console.error('Error creating vote:', insertError);
      return NextResponse.json(
        { error: 'Failed to create vote' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      voted: true,
      message: 'Vote recorded',
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propuestaId = searchParams.get('propuesta_id');

    if (!propuestaId) {
      return NextResponse.json(
        { error: 'Propuesta ID is required' },
        { status: 400 }
      );
    }

    // Fetch vote count from Supabase
    const { count, error } = await supabaseAdmin
      .from('votos')
      .select('id', { count: 'exact' })
      .eq('propuesta_id', propuestaId);

    if (error) {
      console.error('Error fetching vote count:', error);
      return NextResponse.json(
        { error: 'Failed to fetch vote count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      propuesta_id: propuestaId,
      votos_count: count || 0,
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}
