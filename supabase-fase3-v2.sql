-- ============================================================
-- Fase 3 v2: subfases (candidatura → votación/sorteo → confirmación)
-- Ejecutar en: Supabase → SQL Editor
-- ============================================================

-- Campo para marcar "no me presento como representante"
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS declina_representante boolean DEFAULT false;

-- Fecha de inicio de Fase 3 (para temporizador de 14 días)
ALTER TABLE procesos ADD COLUMN IF NOT EXISTS fase3_inicio timestamp with time zone;

-- Subfase dentro de Fase 3: 'candidatura', 'votacion', 'sorteo', 'confirmacion'
ALTER TABLE procesos ADD COLUMN IF NOT EXISTS fase3_subfase text DEFAULT 'candidatura';

-- Fecha límite para responder al sorteo (3 días desde que se les notifica)
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS sorteo_notificado_at timestamp with time zone;
