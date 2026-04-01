import {
  hashEmail,
  generarToken,
  calcularPorcentaje,
  umbralFase2,
  umbralFase3,
  numRepresentantesNecesarios,
} from '@/lib/utils'

// ─────────────────────────────────────────────
// hashEmail
// ─────────────────────────────────────────────
describe('hashEmail', () => {
  test('produce el mismo hash para el mismo email', () => {
    expect(hashEmail('test@empresa.com')).toBe(hashEmail('test@empresa.com'))
  })

  test('normaliza a minúsculas antes de hacer hash', () => {
    expect(hashEmail('Test@Empresa.com')).toBe(hashEmail('test@empresa.com'))
  })

  test('elimina espacios antes de hacer hash', () => {
    expect(hashEmail('  test@empresa.com  ')).toBe(hashEmail('test@empresa.com'))
  })

  test('produce hashes distintos para emails distintos', () => {
    expect(hashEmail('a@empresa.com')).not.toBe(hashEmail('b@empresa.com'))
  })

  test('el hash tiene 64 caracteres (SHA-256 en hex)', () => {
    expect(hashEmail('test@empresa.com')).toHaveLength(64)
  })

  test('el hash solo contiene caracteres hexadecimales', () => {
    expect(hashEmail('test@empresa.com')).toMatch(/^[a-f0-9]+$/)
  })
})

// ─────────────────────────────────────────────
// generarToken
// ─────────────────────────────────────────────
describe('generarToken', () => {
  test('genera un token de 64 caracteres', () => {
    expect(generarToken()).toHaveLength(64)
  })

  test('genera tokens únicos en cada llamada', () => {
    expect(generarToken()).not.toBe(generarToken())
  })

  test('el token solo contiene caracteres hexadecimales', () => {
    expect(generarToken()).toMatch(/^[a-f0-9]+$/)
  })
})

// ─────────────────────────────────────────────
// calcularPorcentaje
// ─────────────────────────────────────────────
describe('calcularPorcentaje', () => {
  test('calcula el 50%', () => {
    expect(calcularPorcentaje(5, 10)).toBe(50)
  })

  test('calcula el 100%', () => {
    expect(calcularPorcentaje(10, 10)).toBe(100)
  })

  test('calcula el 0%', () => {
    expect(calcularPorcentaje(0, 10)).toBe(0)
  })

  test('retorna 0 si el total es 0 (evita división por cero)', () => {
    expect(calcularPorcentaje(5, 0)).toBe(0)
  })

  test('redondea correctamente', () => {
    expect(calcularPorcentaje(1, 3)).toBe(33)
    expect(calcularPorcentaje(2, 3)).toBe(67)
  })

  test('puede superar el 100% (más participantes que objetivo)', () => {
    expect(calcularPorcentaje(15, 10)).toBe(150)
  })
})

// ─────────────────────────────────────────────
// umbralFase2
// ─────────────────────────────────────────────
describe('umbralFase2', () => {
  test('mínimo 3 empleados aunque la empresa sea pequeña', () => {
    expect(umbralFase2(4)).toBe(3)
    expect(umbralFase2(2)).toBe(3)
  })

  test('50% para empresas medianas', () => {
    expect(umbralFase2(20)).toBe(10)
    expect(umbralFase2(100)).toBe(50)
  })

  test('redondea hacia arriba', () => {
    expect(umbralFase2(7)).toBe(4)  // 3.5 → 4
  })
})

// ─────────────────────────────────────────────
// umbralFase3
// ─────────────────────────────────────────────
describe('umbralFase3', () => {
  test('mínimo 5 empleados aunque la empresa sea pequeña', () => {
    expect(umbralFase3(6)).toBe(5)
    expect(umbralFase3(10)).toBe(5)
  })

  test('30% para empresas más grandes', () => {
    expect(umbralFase3(20)).toBe(6)
    expect(umbralFase3(100)).toBe(30)
  })

  test('redondea hacia arriba', () => {
    expect(umbralFase3(10)).toBe(5)  // max(5, 3) = 5
    expect(umbralFase3(17)).toBe(6)  // ceil(17*0.3) = ceil(5.1) = 6
  })
})

// ─────────────────────────────────────────────
// numRepresentantesNecesarios (utils.ts)
// ─────────────────────────────────────────────
describe('numRepresentantesNecesarios (utils simplificado)', () => {
  test('1 representante para empresas de 6 a 30 empleados', () => {
    expect(numRepresentantesNecesarios(10)).toBe(1)
    expect(numRepresentantesNecesarios(30)).toBe(1)
  })

  test('3 representantes para empresas de 31 a 49 empleados', () => {
    expect(numRepresentantesNecesarios(31)).toBe(3)
    expect(numRepresentantesNecesarios(49)).toBe(3)
  })

  test('5 representantes para empresas de 50 o más empleados', () => {
    expect(numRepresentantesNecesarios(50)).toBe(5)
    expect(numRepresentantesNecesarios(200)).toBe(5)
  })
})
