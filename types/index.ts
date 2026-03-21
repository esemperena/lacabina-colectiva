export type FaseProceso = 1 | 2 | 3 | 4

export type EstadoProceso = 'activo' | 'completado' | 'pausado'

export interface Empresa {
  id: string
  nombre: string
  sector: string
  num_empleados: number
  rrhh_email: string
  created_at: string
}

export interface Proceso {
  id: string
  empresa_id: string
  fase: FaseProceso
  estado: EstadoProceso
  token_rrhh: string
  empleados_objetivo: number
  empleados_unidos: number
  created_at: string
  empresa?: Empresa
}

export interface Participante {
  id: string
  proceso_id: string
  email_hash: string
  token_acceso: string
  es_iniciador: boolean
  es_rrhh: boolean
  nombre?: string
  edad?: number
  sexo?: string
  joined_at: string
}

export interface Propuesta {
  id: string
  proceso_id: string
  participante_id?: string
  titulo: string
  descripcion: string
  tipo: 'propuesta' | 'queja' | 'consulta' | 'sugerencia'
  es_anonima: boolean
  votos_count: number
  created_at: string
}

export interface Voto {
  id: string
  propuesta_id: string
  participante_id: string
  created_at: string
}

export interface Candidato {
  id: string
  proceso_id: string
  participante_id: string
  tipo: 'voluntario' | 'sorteo'
  estado: 'pendiente' | 'aceptado' | 'rechazado'
  created_at: string
}
