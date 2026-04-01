import { calcularRepresentantesNecesarios } from '@/lib/fase3'

// ─────────────────────────────────────────────
// calcularRepresentantesNecesarios
// Fuente legal: ET art. 62-66
// ─────────────────────────────────────────────
describe('calcularRepresentantesNecesarios', () => {

  // Límite inferior: empresas sin obligación
  test('0 representantes para empresas con menos de 6 empleados', () => {
    expect(calcularRepresentantesNecesarios(0)).toBe(0)
    expect(calcularRepresentantesNecesarios(5)).toBe(0)
  })

  // 6-30 empleados → 1 delegado de personal
  test('1 representante para empresas de 6 a 30 empleados', () => {
    expect(calcularRepresentantesNecesarios(6)).toBe(1)
    expect(calcularRepresentantesNecesarios(15)).toBe(1)
    expect(calcularRepresentantesNecesarios(30)).toBe(1)
  })

  // 31-49 empleados → 3 delegados de personal
  test('3 representantes para empresas de 31 a 49 empleados', () => {
    expect(calcularRepresentantesNecesarios(31)).toBe(3)
    expect(calcularRepresentantesNecesarios(40)).toBe(3)
    expect(calcularRepresentantesNecesarios(49)).toBe(3)
  })

  // 50-100 → comité de empresa mínimo (5)
  test('5 representantes para empresas de 50 a 100 empleados', () => {
    expect(calcularRepresentantesNecesarios(50)).toBe(5)
    expect(calcularRepresentantesNecesarios(75)).toBe(5)
    expect(calcularRepresentantesNecesarios(100)).toBe(5)
  })

  // 101-250 → 9
  test('9 representantes para empresas de 101 a 250 empleados', () => {
    expect(calcularRepresentantesNecesarios(101)).toBe(9)
    expect(calcularRepresentantesNecesarios(200)).toBe(9)
    expect(calcularRepresentantesNecesarios(250)).toBe(9)
  })

  // 251-500 → 13
  test('13 representantes para empresas de 251 a 500 empleados', () => {
    expect(calcularRepresentantesNecesarios(251)).toBe(13)
    expect(calcularRepresentantesNecesarios(400)).toBe(13)
    expect(calcularRepresentantesNecesarios(500)).toBe(13)
  })

  // 501-750 → 17
  test('17 representantes para empresas de 501 a 750 empleados', () => {
    expect(calcularRepresentantesNecesarios(501)).toBe(17)
    expect(calcularRepresentantesNecesarios(750)).toBe(17)
  })

  // 751-1000 → 21
  test('21 representantes para empresas de 751 a 1000 empleados', () => {
    expect(calcularRepresentantesNecesarios(751)).toBe(21)
    expect(calcularRepresentantesNecesarios(1000)).toBe(21)
  })

  // Más de 1000 → 21 + 3 por cada 1000 adicionales
  test('escala correctamente para más de 1000 empleados', () => {
    expect(calcularRepresentantesNecesarios(1001)).toBe(24) // 21 + 3
    expect(calcularRepresentantesNecesarios(2000)).toBe(24) // 21 + ceil(1000/1000)*3 = 24
    expect(calcularRepresentantesNecesarios(2001)).toBe(27) // 21 + ceil(1001/1000)*3 = 27
    expect(calcularRepresentantesNecesarios(3000)).toBe(27) // 21 + ceil(2000/1000)*3 = 27
  })

  // Casos en los límites exactos
  test('los límites entre rangos son correctos', () => {
    expect(calcularRepresentantesNecesarios(5)).toBe(0)   // último sin representantes
    expect(calcularRepresentantesNecesarios(6)).toBe(1)   // primero con representante
    expect(calcularRepresentantesNecesarios(30)).toBe(1)  // último con 1
    expect(calcularRepresentantesNecesarios(31)).toBe(3)  // primero con 3
    expect(calcularRepresentantesNecesarios(49)).toBe(3)  // último con 3
    expect(calcularRepresentantesNecesarios(50)).toBe(5)  // primero con 5
  })
})
