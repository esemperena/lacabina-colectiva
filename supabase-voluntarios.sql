-- Añadir campo es_voluntario a participantes (Fase 3)
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS es_voluntario boolean DEFAULT false;
