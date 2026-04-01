/**
 * Tests de las rutas /api/propuestas y /api/votos
 * Nota: estas rutas usan participante_id del body (no cookies)
 */

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(),
    rpc: jest.fn().mockResolvedValue({ error: null }),
  },
}))

import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest } from 'next/server'
import { POST as postPropuesta } from '@/app/api/propuestas/route'
import { POST as postVoto } from '@/app/api/votos/route'

function crearRequest(url: string, body: object): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ─────────────────────────────────────────────
// Helpers de mock para propuestas
// ─────────────────────────────────────────────
function mockPropuestasSupabase({ fase = '2', propuestasEnviadas = 0 } = {}) {
  ;(supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
    const self: Record<string, jest.Mock> = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      single: jest.fn(),
    }

    if (table === 'procesos') {
      self.single = jest.fn().mockResolvedValue({ data: { id: 'proc-1', fase }, error: null })
      return self
    }

    if (table === 'participantes') {
      self.single = jest.fn().mockResolvedValue({
        data: { id: 'part-1', propuestas_enviadas: propuestasEnviadas }, error: null,
      })
      return self
    }

    if (table === 'propuestas') {
      self.single = jest.fn().mockResolvedValue({
        data: { id: 'prop-nueva', titulo: 'Test', votos_count: 0, tipo: 'propuesta' }, error: null,
      })
      return self
    }

    self.single = jest.fn().mockResolvedValue({ data: null, error: null })
    return self
  })
}

const PROPUESTA_VALIDA = {
  proceso_id: 'proc-1',
  participante_id: 'part-1',
  titulo: 'Mejorar el horario flexible',
  descripcion: 'Propongo implementar horario flexible de entrada entre las 8 y las 10h.',
  tipo: 'propuesta',
  es_anonima: false,
}

// ─────────────────────────────────────────────
// POST /api/propuestas
// ─────────────────────────────────────────────
describe('POST /api/propuestas', () => {
  beforeEach(() => jest.clearAllMocks())

  test('devuelve 400 si el proceso no está en Fase 2', async () => {
    mockPropuestasSupabase({ fase: '1' })
    const res = await postPropuesta(crearRequest('http://localhost/api/propuestas', PROPUESTA_VALIDA))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Fase 2')
  })

  test('devuelve 400 si faltan campos obligatorios', async () => {
    mockPropuestasSupabase({ fase: '2' })
    const res = await postPropuesta(crearRequest('http://localhost/api/propuestas', {
      proceso_id: 'proc-1',
      // falta titulo, descripcion, tipo
    }))
    expect(res.status).toBe(400)
  })

  test('devuelve 400 si el tipo no es válido', async () => {
    mockPropuestasSupabase({ fase: '2' })
    const res = await postPropuesta(crearRequest('http://localhost/api/propuestas', {
      ...PROPUESTA_VALIDA, tipo: 'insulto',
    }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Invalid tipo')
  })

  test('devuelve 400 si el participante ya envió 6 propuestas', async () => {
    mockPropuestasSupabase({ fase: '2', propuestasEnviadas: 6 })
    const res = await postPropuesta(crearRequest('http://localhost/api/propuestas', PROPUESTA_VALIDA))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('límite')
  })

  test('devuelve 200 con la propuesta creada cuando todo es correcto', async () => {
    mockPropuestasSupabase({ fase: '2', propuestasEnviadas: 2 })
    const res = await postPropuesta(crearRequest('http://localhost/api/propuestas', PROPUESTA_VALIDA))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
  })

  test('acepta los 4 tipos válidos de propuesta', async () => {
    for (const tipo of ['propuesta', 'queja', 'consulta', 'sugerencia']) {
      mockPropuestasSupabase({ fase: '2', propuestasEnviadas: 0 })
      const res = await postPropuesta(crearRequest('http://localhost/api/propuestas', { ...PROPUESTA_VALIDA, tipo }))
      expect(res.status).toBe(200)
    }
  })

  test('rechaza "peticion" como tipo inválido', async () => {
    mockPropuestasSupabase({ fase: '2' })
    const res = await postPropuesta(crearRequest('http://localhost/api/propuestas', {
      ...PROPUESTA_VALIDA, tipo: 'peticion',
    }))
    expect(res.status).toBe(400)
  })
})

// ─────────────────────────────────────────────
// POST /api/votos — toggle de voto
// ─────────────────────────────────────────────
describe('POST /api/votos', () => {
  beforeEach(() => jest.clearAllMocks())

  function mockVotos({ fase = '2', votoExiste = false } = {}) {
    ;(supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
      const self: Record<string, jest.Mock> = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        single: jest.fn(),
      }

      if (table === 'propuestas') {
        self.single = jest.fn().mockResolvedValue({
          data: { id: 'prop-1', proceso_id: 'proc-1' }, error: null,
        })
        return self
      }

      if (table === 'procesos') {
        self.single = jest.fn().mockResolvedValue({ data: { fase }, error: null })
        return self
      }

      if (table === 'votos') {
        if (votoExiste) {
          // Voto existe → toggle off
          self.single = jest.fn().mockResolvedValue({ data: { id: 'voto-1' }, error: null })
          self.delete = jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null }),
          })
        } else {
          // Voto no existe → toggle on
          self.single = jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
          self.insert = jest.fn().mockResolvedValue({ error: null })
        }
        return self
      }

      self.single = jest.fn().mockResolvedValue({ data: null, error: null })
      return self
    })
  }

  const VOTO_BODY = { propuesta_id: 'prop-1', participante_id: 'part-1' }

  test('devuelve 400 si faltan campos requeridos', async () => {
    mockVotos()
    const res = await postVoto(crearRequest('http://localhost/api/votos', { propuesta_id: 'prop-1' }))
    expect(res.status).toBe(400)
  })

  test('devuelve 400 si el proceso no está en Fase 2', async () => {
    mockVotos({ fase: '1' })
    const res = await postVoto(crearRequest('http://localhost/api/votos', VOTO_BODY))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Fase 2')
  })

  test('añade voto si no existía (toggle on) y devuelve voted: true', async () => {
    mockVotos({ fase: '2', votoExiste: false })
    const res = await postVoto(crearRequest('http://localhost/api/votos', VOTO_BODY))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.voted).toBe(true)
  })

  test('elimina voto si ya existía (toggle off) y devuelve voted: false', async () => {
    mockVotos({ fase: '2', votoExiste: true })
    const res = await postVoto(crearRequest('http://localhost/api/votos', VOTO_BODY))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.voted).toBe(false)
  })
})
