-- Tabla para gestionar los tokens de invitación antes de que el empleado se una
CREATE TABLE invitaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proceso_id UUID NOT NULL REFERENCES procesos(id) ON DELETE CASCADE,
  email_hash VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  usado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invitaciones_token ON invitaciones(token);
CREATE INDEX idx_invitaciones_proceso_id ON invitaciones(proceso_id);

ALTER TABLE invitaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Invitaciones solo accesibles por sistema" ON invitaciones FOR ALL USING (FALSE);
