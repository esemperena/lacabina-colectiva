import { NextRequest, NextResponse } from 'next/server';

// TODO: Connect to Supabase when available
// For now, using mock implementation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { proceso_id, propuesta_id } = body;

    // Validate required fields
    if (!proceso_id || !propuesta_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Check if participante already voted on this propuesta
    // TODO: Create voto record in Supabase
    // TODO: Update propuesta votos_count
    // TODO: Handle vote removal if already voted

    const votoId = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('[MOCK] Vote recorded:', {
      votoId,
      proceso_id,
      propuesta_id,
    });

    return NextResponse.json({
      success: true,
      voto_id: votoId,
      proceso_id,
      propuesta_id,
      created_at: new Date().toISOString(),
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

    // TODO: Fetch vote count from Supabase
    // Mock response
    const mockVotes = {
      propuesta_id: propuestaId,
      votos_count: 18,
    };

    return NextResponse.json(mockVotes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}
