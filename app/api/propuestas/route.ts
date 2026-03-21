import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    // Fetch propuestas ordered by votes
    const { data: propuestas, error } = await supabaseAdmin
      .from('propuestas')
      .select('*')
      .eq('proceso_id', procesoId)
      .order('votos_count', { ascending: false });

    if (error) {
      console.error('Error fetching propuestas:', error);
      return NextResponse.json(
        { error: 'Failed to fetch propuestas' },
        { status: 500 }
      );
    }

    return NextResponse.json(propuestas || []);
  } catch (error) {
    console.error('Error fetching propuestas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch propuestas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      proceso_id,
      titulo,
      descripcion,
      tipo,
      es_anonima,
      participante_id,
    } = body;

    // Validate required fields
    if (!proceso_id || !titulo || !descripcion || !tipo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate tipo
    const validTipos = ['propuesta', 'queja', 'consulta', 'sugerencia'];
    if (!validTipos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Invalid tipo' },
        { status: 400 }
      );
    }

    // Create propuesta record
    const { data: propuesta, error } = await supabaseAdmin
      .from('propuestas')
      .insert({
        proceso_id,
        titulo,
        descripcion,
        tipo,
        es_anonima: es_anonima || false,
        participante_id: participante_id || null,
        votos_count: 0,
      })
      .select()
      .single();

    if (error || !propuesta) {
      console.error('Error creating propuesta:', error);
      return NextResponse.json(
        { error: 'Failed to create propuesta' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ...propuesta,
    });
  } catch (error) {
    console.error('Error creating propuesta:', error);
    return NextResponse.json(
      { error: 'Failed to create propuesta' },
      { status: 500 }
    );
  }
}
