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

    // Enforce max 6 proposals per participant
    if (participante_id) {
      const { data: participante } = await supabaseAdmin
        .from('participantes')
        .select('propuestas_enviadas')
        .eq('id', participante_id)
        .single();

      if (participante && (participante.propuestas_enviadas || 0) >= 6) {
        return NextResponse.json(
          { error: 'Has alcanzado el límite de 6 ideas por participante.' },
          { status: 400 }
        );
      }
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

    // Increment propuestas_enviadas counter
    if (participante_id) {
      await supabaseAdmin.rpc('increment_propuestas_enviadas', { p_id: participante_id })
        .then(({ error: rpcError }) => {
          if (rpcError) {
            // Fallback: manual increment
            supabaseAdmin
              .from('participantes')
              .select('propuestas_enviadas')
              .eq('id', participante_id)
              .single()
              .then(({ data }) => {
                supabaseAdmin
                  .from('participantes')
                  .update({ propuestas_enviadas: (data?.propuestas_enviadas || 0) + 1 })
                  .eq('id', participante_id);
              });
          }
        });
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
