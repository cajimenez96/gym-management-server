-- 🔄 DIRECT MEMBER TABLE MODIFICATION FOR MVP
-- Since database is empty, we can modify table structure directly

-- Step 1: Add new required fields
ALTER TABLE member 
ADD COLUMN dni VARCHAR(20) UNIQUE NOT NULL DEFAULT '',
ADD COLUMN first_name TIMESTAMP NOT NULL DEFAULT NOW(),
ADD COLUMN fecha_renovacion TIMESTAMP NOT NULL DEFAULT NOW(),
ADD COLUMN plan VARCHAR(20) NOT NULL DEFAULT 'mensual' CHECK (plan IN ('mensual', 'personalizado'));

-- Step 2: Add computed estado field (will be calculated from fecha_renovacion)
ALTER TABLE member 
ADD COLUMN estado VARCHAR(10) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'vencido'));

-- Step 3: Rename existing fields to Spanish (optional - for MVP consistency)

-- Step 4: Make email optional (remove NOT NULL constraint if exists)
ALTER TABLE member 
ALTER COLUMN email DROP NOT NULL;

-- Step 5: Remove default empty string from dni (now that we have proper structure)
ALTER TABLE member 
ALTER COLUMN dni DROP DEFAULT;

-- Step 6: Create index for fast DNI searches (performance optimization)
CREATE INDEX idx_member_dni ON member(dni);
CREATE INDEX idx_member_estado ON member(estado);
CREATE INDEX idx_member_fecha_renovacion ON member(fecha_renovacion);

-- Step 7: Add comment to table for documentation
COMMENT ON TABLE member IS 'Members table with MVP gym management fields - DNI-based identification';

-- Verification: Show final table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'member' 
ORDER BY ordinal_position; 