-- Cambia la columna duration de integer a VARCHAR(10) y agrega un CHECK constraint
ALTER TABLE public.membership_plan
    ALTER COLUMN duration TYPE VARCHAR(10) USING
        CASE duration
            WHEN 1 THEN 'monthly'
            WHEN 7 THEN 'weekly'
            WHEN 30 THEN 'monthly'
            WHEN 0 THEN 'daily'
            ELSE 'daily' -- Ajusta según tus datos actuales
        END,
    ALTER COLUMN duration SET NOT NULL;

-- Añade un CHECK constraint para los valores permitidos en duration
ALTER TABLE public.membership_plan
    ADD CONSTRAINT membership_plan_duration_check
    CHECK (duration IN ('daily', 'weekly', 'monthly'));

-- (Opcional) Añade un CHECK constraint para price > 0
ALTER TABLE public.membership_plan
    ADD CONSTRAINT membership_plan_price_check
    CHECK (price > 0);

-- (Opcional) Cambia created_at y updated_at a TIMESTAMPTZ
ALTER TABLE public.membership_plan
    ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
    ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

-- (Opcional) Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_membership_plan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_membership_plan_updated_at ON public.membership_plan;
CREATE TRIGGER trigger_update_membership_plan_updated_at
BEFORE UPDATE ON public.membership_plan
FOR EACH ROW
EXECUTE FUNCTION update_membership_plan_updated_at(); 