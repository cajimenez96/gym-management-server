-- 🔄 DIRECT MEMBER TABLE MODIFICATION FOR MVP
-- Since database is empty, we can modify table structure directly

-- Step 1: Add new required fields, checking if they exist first

DO $$
BEGIN
   IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='member' AND column_name='dni') THEN
      ALTER TABLE member ADD COLUMN dni VARCHAR(20) UNIQUE NOT NULL DEFAULT '';
   END IF;
   -- NOTA: La columna first_name como TIMESTAMP parece inusual. Asumiendo que es correcto para tu esquema.
   -- Si necesitas que sea VARCHAR, deberás ajustarlo aquí.
   IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='member' AND column_name='first_name') THEN
      ALTER TABLE member ADD COLUMN first_name TIMESTAMP NOT NULL DEFAULT NOW();
   END IF;
   IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='member' AND column_name='fecha_renovacion') THEN
      ALTER TABLE member ADD COLUMN fecha_renovacion TIMESTAMP NOT NULL DEFAULT NOW();
   END IF;
END$$;

-- Manejo de la columna 'plan' y 'membership_plan_id'
DO $$
BEGIN
   -- Eliminar la columna 'plan' si existe y es del tipo VARCHAR(20) (definición antigua)
   IF EXISTS(SELECT 1 FROM information_schema.columns 
             WHERE table_name='member' AND column_name='plan' AND (character_maximum_length = 20 OR udt_name = 'varchar')) THEN
      ALTER TABLE member DROP COLUMN plan;
   END IF;

   -- Añadir 'membership_plan_id' si no existe
   IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='member' AND column_name='membership_plan_id') THEN
      ALTER TABLE member ADD COLUMN membership_plan_id UUID NULL;
   END IF;

   -- Añadir la clave foránea si no existe (fk_member_membership_plan es el nombre que le dimos)
   IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE constraint_name='fk_member_membership_plan' AND table_name='member') THEN
      ALTER TABLE member ADD CONSTRAINT fk_member_membership_plan
          FOREIGN KEY(membership_plan_id)
          REFERENCES membership_plan(id)
          ON DELETE SET NULL; -- O ON DELETE RESTRICT
   END IF;
END$$;

-- Step 2: Add 'estado' field if it doesn't exist
DO $$
BEGIN
   IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='member' AND column_name='estado') THEN
      ALTER TABLE member ADD COLUMN estado VARCHAR(10) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'vencido'));
   END IF;
END$$;

-- Step 3: Rename existing fields to Spanish (optional - for MVP consistency)

-- Step 4: Make email optional (remove NOT NULL constraint if exists)
DO $$
BEGIN
   IF EXISTS(SELECT 1 FROM information_schema.columns 
             WHERE table_name='member' AND column_name='email' AND is_nullable='NO') THEN
      ALTER TABLE member ALTER COLUMN email DROP NOT NULL;
   END IF;
END$$;

-- Step 5: Remove default empty string from dni (if it has that default)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'member' AND column_name = 'dni' AND column_default = '''''::character varying') THEN
        ALTER TABLE member ALTER COLUMN dni DROP DEFAULT;
    END IF;
END$$;

-- Step 6: Create indexes if they don't exist
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace 
                  WHERE c.relname = 'idx_member_dni' AND n.nspname = 'public') THEN
      CREATE INDEX idx_member_dni ON member(dni);
   END IF;
   IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace 
                  WHERE c.relname = 'idx_member_estado' AND n.nspname = 'public') THEN
      CREATE INDEX idx_member_estado ON member(estado);
   END IF;
   IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace 
                  WHERE c.relname = 'idx_member_fecha_renovacion' AND n.nspname = 'public') THEN
      CREATE INDEX idx_member_fecha_renovacion ON member(fecha_renovacion);
   END IF;
END$$;

-- Step 7: Add comment to table for documentation
COMMENT ON TABLE member IS 'Members table with MVP gym management fields - DNI-based identification';

-- Verification: Show final table structure
SELECT column_name, data_type, is_nullable, column_default, character_maximum_length, udt_name 
FROM information_schema.columns 
WHERE table_name = 'member' 
ORDER BY ordinal_position; 