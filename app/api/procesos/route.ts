import { NextRequest, NextResponse } from 'next/server';

// TODO: Connect to Supabase when available
// For now, using mock implementation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      nombre,
      sector,
      num_empleados,
      rrhh_email,
      iniciador_email,
      colegas_emails,
    } = body;

    // Validate required fields
    if (!nombre || !sector || !num_empleados || !rrhh_email || !iniciador_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(colegas_emails) || colegas_emails.length === 0) {
      return NextResponse.json(
        { error: 'At least one colleague email is required' },
        { status: 400 }
      );
    }

    // Mock data - generate IDs
    const procesoId = `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tokenRRHH = `token_rrhh_${Math.random().toString(36).substr(2, 16)}`;
    const tokenIniciador = `token_init_${Math.random().toString(36).substr(2, 16)}`;

    // TODO: Create empresa record in Supabase
    // TODO: Create proceso record in Supabase
    // TODO: Create participante record for initiator (hash email)
    // TODO: Generate tokens for each colleague and RRHH
    // TODO: Send invitation emails via Resend

    console.log('[MOCK] Proceso created:', {
      procesoId,
      empresa: nombre,
      sector,
      num_empleados,
      rrhh_email,
      iniciador_email,
      num_colegas: colegas_emails.length,
      colegas_emails,
      tokenRRHH,
      tokenIniciador,
    });

    return NextResponse.json({
      success: true,
      proceso_id: procesoId,
      token_iniciador: tokenIniciador,
      token_rrhh: tokenRRHH,
      message: 'Proceso created successfully. Invitations sent to colleagues.',
    });
  } catch (error) {
    console.error('Error creating proceso:', error);
    return NextResponse.json(
      { error: 'Failed to create proceso' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const procesoId = searchParams.get('id');

    if (!procesoId) {
      return NextResponse.json(
        { error: 'Proceso ID is required' },
        { status: 400 }
      );
    }

    // TODO: Fetch proceso from Supabase
    // Mock response
    const mockProceso = {
      id: procesoId,
      empresa: {
        id: 'emp_123',
        nombre: 'Empresa Demo',
        sector: 'tecnología',
        num_empleados: 150,
      },
      fase: 1,
      estado: 'activo',
      empleados_objetivo: 150,
      empleados_unidos: 23,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(mockProceso);
  } catch (error) {
    console.error('Error fetching proceso:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proceso' },
      { status: 500 }
    );
  }
}
