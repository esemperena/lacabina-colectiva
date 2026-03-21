import { NextRequest, NextResponse } from 'next/server';

// TODO: Connect to Supabase when available
// For now, using mock implementation

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

    // TODO: Verify token exists in database
    // TODO: Check if token hasn't been used yet
    // TODO: Create participante record in Supabase
    // TODO: Hash email if available
    // TODO: Generate access token for participant

    const procesoId = `proc_${Math.random().toString(36).substr(2, 9)}`;
    const participanteId = `part_${Math.random().toString(36).substr(2, 9)}`;
    const tokenAcceso = `token_acc_${Math.random().toString(36).substr(2, 16)}`;

    console.log('[MOCK] Participante joined:', {
      token,
      participanteId,
      procesoId,
      nombre: nombre || 'anonymous',
      edad: edad || 'not provided',
      sexo: sexo || 'not specified',
      tokenAcceso,
    });

    return NextResponse.json({
      success: true,
      participante_id: participanteId,
      proceso_id: procesoId,
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

    // TODO: Fetch participantes count from Supabase
    // Mock response
    const mockParticipantes = {
      total: 23,
      proceso_id: procesoId,
    };

    return NextResponse.json(mockParticipantes);
  } catch (error) {
    console.error('Error fetching participantes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participantes' },
      { status: 500 }
    );
  }
}
