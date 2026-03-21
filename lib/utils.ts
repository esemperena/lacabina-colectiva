import crypto from 'crypto'

export function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex')
}

export function generarToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function calcularPorcentaje(parte: number, total: number): number {
  if (total === 0) return 0
  return Math.round((parte / total) * 100)
}

export function umbralFase2(numEmpleados: number): number {
  // Necesitamos al menos el 50% de empleados para pasar a Fase 2
  // Mínimo 3 empleados
  return Math.max(3, Math.ceil(numEmpleados * 0.5))
}

export function umbralFase3(numEmpleados: number): number {
  // Para fase 3 de representantes, necesitamos al menos el 30% más
  return Math.max(5, Math.ceil(numEmpleados * 0.3))
}

export function numRepresentantesNecesarios(numEmpleados: number): number {
  // Según ley española: 1-30 empleados → 1 delegado, 31-49 → 3, 50+ → comité
  if (numEmpleados < 31) return 1
  if (numEmpleados < 50) return 3
  return 5 // comité de empresa mínimo
}
