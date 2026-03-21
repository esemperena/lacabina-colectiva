-- Tabla de anuncios publicados por RRHH para los empleados
CREATE TABLE IF NOT EXISTS anuncios (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proceso_id  UUID NOT NULL REFERENCES procesos(id) ON DELETE CASCADE,
  contenido   TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar por proceso
CREATE INDEX IF NOT EXISTS anuncios_proceso_id_idx ON anuncios(proceso_id);
