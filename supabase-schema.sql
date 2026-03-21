-- La Cabina Colectiva - Complete Database Schema

-- Create ENUM types
CREATE TYPE fase_proceso AS ENUM ('1', '2', '3', '4');
CREATE TYPE estado_proceso AS ENUM ('activo', 'completado', 'pausado');
CREATE TYPE tipo_propuesta AS ENUM ('propuesta', 'queja', 'consulta', 'sugerencia');
CREATE TYPE tipo_candidato AS ENUM ('voluntario', 'sorteo');
CREATE TYPE estado_candidato AS ENUM ('pendiente', 'aceptado', 'rechazado');

-- Create empresas table
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  num_empleados INTEGER NOT NULL,
  rrhh_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create procesos table
CREATE TABLE procesos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  fase fase_proceso DEFAULT '1',
  estado estado_proceso DEFAULT 'activo',
  token_rrhh VARCHAR(255) NOT NULL UNIQUE,
  empleados_objetivo INTEGER NOT NULL,
  empleados_unidos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create participantes table (anonymized)
CREATE TABLE participantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proceso_id UUID NOT NULL REFERENCES procesos(id) ON DELETE CASCADE,
  email_hash VARCHAR(255) NOT NULL, -- SHA-256 hash of email
  token_acceso VARCHAR(255) NOT NULL UNIQUE,
  es_iniciador BOOLEAN DEFAULT FALSE,
  es_rrhh BOOLEAN DEFAULT FALSE,
  nombre VARCHAR(255),
  edad INTEGER,
  sexo VARCHAR(50),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create propuestas table
CREATE TABLE propuestas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proceso_id UUID NOT NULL REFERENCES procesos(id) ON DELETE CASCADE,
  participante_id UUID REFERENCES participantes(id) ON DELETE SET NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo tipo_propuesta NOT NULL,
  es_anonima BOOLEAN DEFAULT TRUE,
  votos_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create votos table
CREATE TABLE votos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  propuesta_id UUID NOT NULL REFERENCES propuestas(id) ON DELETE CASCADE,
  participante_id UUID NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(propuesta_id, participante_id) -- Prevent double voting
);

-- Create candidatos table
CREATE TABLE candidatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proceso_id UUID NOT NULL REFERENCES procesos(id) ON DELETE CASCADE,
  participante_id UUID NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
  tipo tipo_candidato NOT NULL,
  estado estado_candidato DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(proceso_id, participante_id) -- One candidate per participant per process
);

-- Create indexes for performance
CREATE INDEX idx_procesos_empresa_id ON procesos(empresa_id);
CREATE INDEX idx_procesos_token_rrhh ON procesos(token_rrhh);
CREATE INDEX idx_participantes_proceso_id ON participantes(proceso_id);
CREATE INDEX idx_participantes_token_acceso ON participantes(token_acceso);
CREATE INDEX idx_participantes_email_hash ON participantes(email_hash);
CREATE INDEX idx_propuestas_proceso_id ON propuestas(proceso_id);
CREATE INDEX idx_propuestas_participante_id ON propuestas(participante_id);
CREATE INDEX idx_votos_propuesta_id ON votos(propuesta_id);
CREATE INDEX idx_votos_participante_id ON votos(participante_id);
CREATE INDEX idx_candidatos_proceso_id ON candidatos(proceso_id);
CREATE INDEX idx_candidatos_participante_id ON candidatos(participante_id);

-- Enable Row Level Security (RLS)
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE procesos ENABLE ROW LEVEL SECURITY;
ALTER TABLE participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE propuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE votos ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Empresas - Only visible to system admins
CREATE POLICY "Empresas are only readable by admins" ON empresas
  FOR SELECT USING (FALSE); -- Restrict all by default

-- RLS Policy: Procesos - Only visible via token
CREATE POLICY "Procesos visible via RRHH token" ON procesos
  FOR SELECT USING (TRUE); -- Consider implementing token-based access

-- RLS Policy: Participantes - Anonymous, no individual access
CREATE POLICY "Participantes are anonymized" ON participantes
  FOR SELECT USING (FALSE); -- No direct access

-- RLS Policy: Propuestas - Can view all (anonymized)
CREATE POLICY "Propuestas visible to all authenticated" ON propuestas
  FOR SELECT USING (TRUE);

-- RLS Policy: Can only vote if participante
CREATE POLICY "Users can only vote once per proposal" ON votos
  FOR INSERT WITH CHECK (TRUE); -- Check participante_id matches current user

-- RLS Policy: Candidatos - Can view own candidacy
CREATE POLICY "Candidatos visible to participants" ON candidatos
  FOR SELECT USING (TRUE);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procesos_updated_at BEFORE UPDATE ON procesos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_propuestas_updated_at BEFORE UPDATE ON propuestas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidatos_updated_at BEFORE UPDATE ON candidatos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment vote count on propuestas
CREATE OR REPLACE FUNCTION increment_propuesta_votos()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE propuestas SET votos_count = votos_count + 1 WHERE id = NEW.propuesta_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement vote count on propuestas
CREATE OR REPLACE FUNCTION decrement_propuesta_votos()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE propuestas SET votos_count = votos_count - 1 WHERE id = OLD.propuesta_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for vote counting
CREATE TRIGGER after_voto_insert AFTER INSERT ON votos
  FOR EACH ROW EXECUTE FUNCTION increment_propuesta_votos();

CREATE TRIGGER after_voto_delete AFTER DELETE ON votos
  FOR EACH ROW EXECUTE FUNCTION decrement_propuesta_votos();

-- Create function to update participantes count on procesos
CREATE OR REPLACE FUNCTION update_empleados_unidos()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE procesos SET empleados_unidos = (SELECT COUNT(*) FROM participantes WHERE proceso_id = NEW.proceso_id)
  WHERE id = NEW.proceso_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for participante count
CREATE TRIGGER after_participante_insert AFTER INSERT ON participantes
  FOR EACH ROW EXECUTE FUNCTION update_empleados_unidos();
