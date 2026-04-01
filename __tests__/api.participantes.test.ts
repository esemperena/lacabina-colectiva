/**
 * Tests de la ruta POST /api/participantes
 * Cubre: flujo invitación, flujo iniciador, tokens inválidos
 */

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: { from: jest.fn() },
}))

jest.mock('@/lib/email', () => ({
  enviarEmailInicioFase2: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/lib/utils', () => ({
  generarToken: jest.fn(() => 'token_nuevo_mock'),
}))

import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/participantes/route'

function crearRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/participantes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function buildChain(data: unknown, error: unknown = null) {
  const self: Record<string, jest.Mock> = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  }
  return self
}

/**
 * Flujo de invitación: token encontrado en tabla invitaciones
 */
function mockFlujoInvitacionValida() {
  ;(supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
    if (table === 'invitaciones') {
      return {
        ...buildChain({ id: 'inv-1', proceso_id: 'proc-1', email_hash: 'hash', usado: false }),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      }
    }
    if (table === 'participantes') {
      return {
        ...buildChain({ id: 'part-nuevo', proceso_id: 'proc-1', token_acceso: 'token_nuevo_mock' }),
        insert: jest.fn().mockReturnThis(),
      }
    }
    if (table === 'procesos') {
      return buildChain({
        id: 'proc-1', fase: '1',
        empleados_unidos: 1, empleados_objetivo: 20,
        empresa: { nombre: 'Empresa' },
      })
    }
    return buildChain(null)
  })
}

/**
 * Flujo de invitación: token NO encontrado en invitaciones → cae en participantes (iniciador)
 */
function mockFlujoIniciadorValido() {
  ;(supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
    if (table === 'invitaciones') {
      // No encontrado → null
      return buildChain(null, { message: 'not found' })
    }
    if (table === 'participantes') {
      return {
        ...buildChain({ id: 'part-iniciador', proceso_id: 'proc-1', token_acceso: 'token-iniciador', es_iniciador: true }),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      }
    }
    if (table === 'procesos') {
      return buildChain({
        id: 'proc-1', fase: '1',
        empleados_unidos: 1, empleados_objetivo: 20,
        empresa: { nombre: 'Empresa' },
      })
    }
    return buildChain(null)
  })
}

/**
 * Token no existe en ninguna tabla
 */
function mockTokenInexistente() {
  ;(supabaseAdmin.from as jest.Mock).mockImplementation(() =>
    buildChain(null, { message: 'not found' })
  )
}

beforeEach(() => jest.clearAllMocks())

// ─────────────────────────────────────────────
// Validación básica
// ─────────────────────────────────────────────
describe('POST /api/participantes — validación básica', () => {
  test('devuelve 400 si no se envía ningún token', async () => {
    mockFlujoInvitacionValida()
    const res = await POST(crearRequest({ nombre: 'Ana', apellidos: 'López', sexo: 'f' }))
    expect(res.status).toBe(400)
  })

  test('devuelve 400 si el token no existe en ninguna tabla', async () => {
    mockTokenInexistente()
    const res = await POST(crearRequest({ token: 'token_inexistente', nombre: 'Ana', apellidos: 'López', sexo: 'f' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('inválido')
  })
})

// ─────────────────────────────────────────────
// Flujo desde invitación (compañeros)
// ─────────────────────────────────────────────
describe('POST /api/participantes — flujo invitación', () => {
  test('devuelve 200 con token_acceso cuando el token de invitación es válido', async () => {
    mockFlujoInvitacionValida()
    const res = await POST(crearRequest({ token: 'token_valido', nombre: 'Ana', apellidos: 'López', sexo: 'f' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.token_acceso).toBeDefined()
    expect(data.proceso_id).toBeDefined()
  })

  test('devuelve token_acceso distinto del token de invitación', async () => {
    mockFlujoInvitacionValida()
    const res = await POST(crearRequest({ token: 'token_invitacion_original', nombre: 'Ana', apellidos: 'López', sexo: 'f' }))
    const data = await res.json()
    // El token de acceso es nuevo (generado), distinto al token de invitación
    expect(data.token_acceso).toBe('token_nuevo_mock')
  })
})

// ─────────────────────────────────────────────
// Flujo iniciador (usa su token_acceso original)
// ─────────────────────────────────────────────
describe('POST /api/participantes — flujo iniciador', () => {
  test('devuelve 200 con token_acceso para el iniciador que completa su registro', async () => {
    mockFlujoIniciadorValido()
    const res = await POST(crearRequest({ token: 'token-iniciador', nombre: 'Carlos', apellidos: 'García', sexo: 'm' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.token_acceso).toBe('token-iniciador') // devuelve el mismo token
  })

  test('el iniciador recibe su mismo token de acceso (no uno nuevo)', async () => {
    mockFlujoIniciadorValido()
    const res = await POST(crearRequest({ token: 'token-iniciador', nombre: 'Carlos', apellidos: 'García', sexo: 'm' }))
    const data = await res.json()
    expect(data.token_acceso).toBe('token-iniciador')
  })
})
