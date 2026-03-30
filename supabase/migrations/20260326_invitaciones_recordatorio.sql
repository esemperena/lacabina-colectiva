-- Añade email y ultimo_recordatorio a la tabla invitaciones
-- para poder enviar recordatorios a compañeros que no se han unido

ALTER TABLE invitaciones
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS ultimo_recordatorio TIMESTAMPTZ;
