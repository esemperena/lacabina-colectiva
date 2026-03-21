-- Fase 2 schema additions
-- Run this in the Supabase SQL editor

-- Store contact email for phase transition notifications
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS email_contacto TEXT;

-- Track whether participant has marked "no more proposals"
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS listo_fase2 BOOLEAN DEFAULT FALSE;

-- Track number of proposals submitted per participant
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS propuestas_enviadas INTEGER DEFAULT 0;

-- Store when Phase 2 started (for 2-week limit)
ALTER TABLE procesos ADD COLUMN IF NOT EXISTS fase2_inicio TIMESTAMP WITH TIME ZONE;

-- Function to safely increment propuestas_enviadas
CREATE OR REPLACE FUNCTION increment_propuestas_enviadas(p_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE participantes
  SET propuestas_enviadas = COALESCE(propuestas_enviadas, 0) + 1
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;
