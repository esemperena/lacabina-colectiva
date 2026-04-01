/**
 * Tests de la ruta POST /api/procesos
 * Cubre: validaciones de entrada, rate limiting y creación del proceso
 */

// ── Mocks ──────────────────────────────────────────────────────────────────
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: { from: jest.fn() },
}))

jest.mock('@/lib/email', () => ({
  enviarBienvenidaIniciador: jest.fn().mockResolvedValue(undefined),
  enviarInvitacionEmpleado: jest.fn().mockResolvedValue(undefined),
  enviarNotificacionRRHH: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/lib/utils', () => ({
  hashEmail: jest.fn((email: string) => `hash_${email}`),
  generarToken: jest.fn(() => 'token_mock'),
}))

import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/procesos/route'

function crearRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/procesos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * Monta el mock de supabaseAdmin con respuestas controladas.
 * Cada tabla devuelve un objeto que soporta las cadenas de llamadas reales del código.
 */
function mockSupabase({ rateLimitCount = 0, empresaOk = true, procesoOk = true } = {}) {
  ;(supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
    // Objeto base con todos los métodos encadenables
    const base = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      then: undefined as unknown, // se sobreescribe por tabla
    }

    if (table === 'participantes') {
      // rate limiting: .select().eq().eq().gte() → Promise { count }
      const obj = {
        ...base,
        gte: jest.fn().mockResolvedValue({ count: rateLimitCount, error: null }),
        // insert del participante iniciador
        insert: jest.fn().mockResolvedValue({ error: null }),
      }
      obj.select = jest.fn().mockReturnValue(obj)
      obj.eq = jest.fn().mockReturnValue(obj)
      return obj
    }

    if (table === 'empresas') {
      return {
        ...base,
        single: jest.fn().mockResolvedValue(
          empresaOk
            ? { data: { id: 'empresa-1', nombre: 'Empresa Test' }, error: null }
            : { data: null, error: { message: 'DB error' } }
        ),
      }
    }

    if (table === 'procesos') {
      return {
        ...base,
        single: jest.fn().mockResolvedValue(
          procesoOk
            ? { data: { id: 'proceso-1', fase: '1' }, error: null }
            : { data: null, error: { message: 'DB error' } }
        ),
      }
    }

    if (table === 'invitaciones') {
      return {
        ...base,
        insert: jest.fn().mockResolvedValue({ error: null }),
      }
    }

    return { ...base, insert: jest.fn().mockResolvedValue({ error: null }) }
  })
}

const BODY_VALIDO = {
  nombre: 'Empresa Test',
  sector: 'tecnologia',
  num_empleados: 20,
  rrhh_email: 'rrhh@empresa.com',
  iniciador_email: 'empleado@empresa.com',
  colegas_emails: ['colega1@empresa.com', 'colega2@empresa.com'],
}

beforeEach(() => jest.clearAllMocks())

// ─────────────────────────────────────────────
// Validaciones de entrada
// ─────────────────────────────────────────────
describe('POST /api/procesos — validaciones de entrada', () => {
  test('devuelve 400 si falta el nombre de la empresa', async () => {
    mockSupabase()
    const { nombre: _, ...sinNombre } = BODY_VALIDO
    const res = await POST(crearRequest(sinNombre))
    expect(res.status).toBe(400)
  })

  test('devuelve 400 si falta el email de RRHH', async () => {
    mockSupabase()
    const { rrhh_email: _, ...sinRRHH } = BODY_VALIDO
    const res = await POST(crearRequest(sinRRHH))
    expect(res.status).toBe(400)
  })

  test('devuelve 400 si falta el email del iniciador', async () => {
    mockSupabase()
    const { iniciador_email: _, ...sinIniciador } = BODY_VALIDO
    const res = await POST(crearRequest(sinIniciador))
    expect(res.status).toBe(400)
  })

  test('devuelve 400 si colegas_emails está vacío', async () => {
    mockSupabase()
    const res = await POST(crearRequest({ ...BODY_VALIDO, colegas_emails: [] }))
    expect(res.status).toBe(400)
  })

  test('devuelve 400 si colegas_emails no es un array', async () => {
    mockSupabase()
    const res = await POST(crearRequest({ ...BODY_VALIDO, colegas_emails: 'colega@empresa.com' }))
    expect(res.status).toBe(400)
  })

  test('devuelve 400 si la empresa tiene menos de 6 empleados', async () => {
    mockSupabase()
    const res = await POST(crearRequest({ ...BODY_VALIDO, num_empleados: 5 }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('6 empleados')
  })

  test('devuelve 400 con exactamente 5 empleados (límite inferior)', async () => {
    mockSupabase()
    const res = await POST(crearRequest({ ...BODY_VALIDO, num_empleados: 5 }))
    expect(res.status).toBe(400)
  })
})

// ─────────────────────────────────────────────
// Rate limiting
// ─────────────────────────────────────────────
describe('POST /api/procesos — rate limiting', () => {
  test('devuelve 429 si el iniciador ya tiene 3 procesos en las últimas 24h', async () => {
    mockSupabase({ rateLimitCount: 3 })
    const res = await POST(crearRequest(BODY_VALIDO))
    expect(res.status).toBe(429)
  })

  test('permite crear si el iniciador solo tiene 2 procesos recientes', async () => {
    mockSupabase({ rateLimitCount: 2 })
    const res = await POST(crearRequest(BODY_VALIDO))
    expect(res.status).not.toBe(429)
  })

  test('permite crear si el iniciador no tiene procesos recientes', async () => {
    mockSupabase({ rateLimitCount: 0 })
    const res = await POST(crearRequest(BODY_VALIDO))
    expect(res.status).not.toBe(429)
  })
})

// ─────────────────────────────────────────────
// Errores de base de datos
// ─────────────────────────────────────────────
describe('POST /api/procesos — errores de BD', () => {
  test('devuelve 500 si falla la creación de la empresa', async () => {
    mockSupabase({ rateLimitCount: 0, empresaOk: false })
    const res = await POST(crearRequest(BODY_VALIDO))
    expect(res.status).toBe(500)
  })

  test('devuelve 500 si falla la creación del proceso', async () => {
    mockSupabase({ rateLimitCount: 0, empresaOk: true, procesoOk: false })
    const res = await POST(crearRequest(BODY_VALIDO))
    expect(res.status).toBe(500)
  })
})

// ─────────────────────────────────────────────
// Creación exitosa
// ─────────────────────────────────────────────
describe('POST /api/procesos — creación exitosa', () => {
  test('devuelve 200 con proceso_id cuando todo es correcto', async () => {
    mockSupabase({ rateLimitCount: 0 })
    const res = await POST(crearRequest(BODY_VALIDO))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.proceso_id).toBeDefined()
  })

  test('acepta empresas con exactamente 6 empleados (mínimo legal)', async () => {
    mockSupabase({ rateLimitCount: 0 })
    const res = await POST(crearRequest({ ...BODY_VALIDO, num_empleados: 6 }))
    expect(res.status).toBe(200)
  })
})
