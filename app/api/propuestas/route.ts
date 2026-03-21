import { NextRequest, NextResponse } from 'next/server';

// TODO: Connect to Supabase when available
// For now, using mock implementation

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

    // TODO: Fetch propuestas from Supabase
    // Mock response
    const mockPropuestas = [
      {
        id: '1',
        proceso_id: procesoId,
        titulo: 'Mejorar el horario de trabajo',
        descripcion: 'Solicito la posibilidad de trabajar con horarios más flexibles.',
        tipo: 'propuesta',
        es_anonima: true,
        votos_count: 18,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        proceso_id: procesoId,
        titulo: 'Aumento de capacitación profesional',
        descripcion: 'Aumentar el presupuesto anual para cursos y certificaciones.',
        tipo: 'propuesta',
        es_anonima: true,
        votos_count: 15,
        created_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json(mockPropuestas);
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

    // TODO: Create propuesta record in Supabase
    const propuestaId = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('[MOCK] Propuesta created:', {
      propuestaId,
      proceso_id,
      titulo,
      descripcion,
      tipo,
      es_anonima,
    });

    return NextResponse.json({
      success: true,
      id: propuestaId,
      proceso_id,
      titulo,
      descripcion,
      tipo,
      es_anonima,
      votos_count: 0,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating propuesta:', error);
    return NextResponse.json(
      { error: 'Failed to create propuesta' },
      { status: 500 }
    );
  }
}
