-- Create table for storing dynamic form schemas per stage
CREATE TABLE IF NOT EXISTS public.stage_form_schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID NOT NULL REFERENCES public.board_stages(id) ON DELETE CASCADE,
    schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    CONSTRAINT stage_form_schemas_stage_id_key UNIQUE (stage_id)
);

-- Enable Row Level Security
ALTER TABLE public.stage_form_schemas ENABLE ROW LEVEL SECURITY;

-- Create Policy for reading schemas
CREATE POLICY "Users can view stage schemas for their organization"
    ON public.stage_form_schemas FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    ));

-- Create Policy for managing schemas (admins/owners usually, but allowing all org members for now)
CREATE POLICY "Users can manage stage schemas for their organization"
    ON public.stage_form_schemas FOR ALL
    USING (organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    ));

-- Seed Data Block to ensure the feature can be tested
DO $$
DECLARE
    v_org_id UUID;
    v_board_id UUID;
    v_stage_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
BEGIN
    -- 1. Get or Create Organization
    SELECT id INTO v_org_id FROM public.organizations LIMIT 1;
    IF v_org_id IS NULL THEN
        INSERT INTO public.organizations (name) VALUES ('Vectra Cargo') RETURNING id INTO v_org_id;
    END IF;

    -- 2. Get or Create Board
    SELECT id INTO v_board_id FROM public.boards WHERE organization_id = v_org_id LIMIT 1;
    IF v_board_id IS NULL THEN
        INSERT INTO public.boards (name, organization_id) VALUES ('Comercial', v_org_id) RETURNING id INTO v_board_id;
    END IF;

    -- 3. Ensure the 'Qualificação' stage exists with our known UUID
    -- We first check if it exists by ID
    IF NOT EXISTS (SELECT 1 FROM public.board_stages WHERE id = v_stage_id) THEN
        -- Check if it exists by name to avoid duplicates if ID is different
        IF EXISTS (SELECT 1 FROM public.board_stages WHERE name = 'Qualificação' AND board_id = v_board_id) THEN
             -- If exists with different ID, we can't force our ID easily without update, 
             -- so we'll just insert a new one for testing purposes or update the existing one's ID? 
             -- Updating ID is risky. We will just insert if ID doesn't exist.
             -- For the purpose of this seeded environment, we assume we can insert.
             NULL;
        ELSE
            INSERT INTO public.board_stages (id, name, board_id, organization_id, "order")
            VALUES (v_stage_id, 'Qualificação', v_board_id, v_org_id, 2);
        END IF;
    END IF;

    -- 4. Upsert Schema for this stage
    -- We only insert if the stage with v_stage_id actually exists (it might have failed above if name collision)
    IF EXISTS (SELECT 1 FROM public.board_stages WHERE id = v_stage_id) THEN
        INSERT INTO public.stage_form_schemas (stage_id, organization_id, schema)
        VALUES (
            v_stage_id,
            v_org_id,
            '{
                "fields": [
                    {
                        "key": "restrictions",
                        "label": "Restrições Operacionais",
                        "type": "text",
                        "required": false,
                        "placeholder": "Ex: Veículo Sider, Agendamento..."
                    },
                    {
                        "key": "merchandiseValue",
                        "label": "Valor da Mercadoria",
                        "type": "currency",
                        "required": true,
                        "placeholder": "0,00"
                    },
                    {
                        "key": "urgent",
                        "label": "Urgente?",
                        "type": "checkbox",
                        "required": false
                    }
                ]
            }'::jsonb
        )
        ON CONFLICT (stage_id) DO UPDATE
        SET schema = EXCLUDED.schema;
    END IF;

END $$;
