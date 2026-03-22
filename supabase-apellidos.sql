-- Añadir apellidos a la tabla participantes
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS apellidos text;
