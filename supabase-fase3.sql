-- Fase 3: representantes elegidos/sorteados
-- Campo para saber si el participante fue elegido como representante final
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS es_representante boolean DEFAULT false;
-- Estado de aceptación: null = sin asignar, 'pendiente' = sorteado/esperando, 'aceptado', 'rechazado'
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS estado_representante text;

-- Tabla de votos para fase 3 (elección de representantes)
CREATE TABLE IF NOT EXISTS votos_representantes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  proceso_id uuid REFERENCES procesos(id) NOT NULL,
  votante_id uuid REFERENCES participantes(id) NOT NULL,
  candidato_id uuid REFERENCES participantes(id) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (votante_id, candidato_id)
);
