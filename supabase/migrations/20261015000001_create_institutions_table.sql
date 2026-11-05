-- ============================================================================
-- Migration: create_institutions_table.sql
-- Description: Create institutions table for all South African public universities
--              and primary TVET colleges, and link applications to institution_id.
-- ============================================================================

-- 1. Create institutions table
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    short_name TEXT,
    type TEXT NOT NULL CHECK (type IN ('Public University', 'TVET', 'Private')),
    campus TEXT,
    province TEXT DEFAULT 'Mpumalanga',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast lookup by name and short_name
CREATE INDEX IF NOT EXISTS idx_institutions_name ON public.institutions(name);
CREATE INDEX IF NOT EXISTS idx_institutions_short_name ON public.institutions(short_name);
CREATE INDEX IF NOT EXISTS idx_institutions_type ON public.institutions(type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all institutions (students can select when applying)
CREATE POLICY "Allow public read access to institutions"
    ON public.institutions
    FOR SELECT
    USING (true);

-- Allow only administrators to insert/update institutions
CREATE POLICY "Allow admin full access to institutions"
    ON public.institutions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 2. Pre-populate all 26 South African Public Universities and Regional TVET Colleges
INSERT INTO public.institutions (name, short_name, type, campus, province) VALUES
    -- Mpumalanga Primary Partner Institutions (Local to Nelspruit / Mbombela)
    ('University of Mpumalanga', 'UMP', 'Public University', 'Mbombela Campus (Main) & Siyabuswa', 'Mpumalanga'),
    ('Tshwane University of Technology', 'TUT', 'Public University', 'Nelspruit / Mbombela Campus', 'Mpumalanga'),
    ('Ehlanzeni TVET College', 'Ehlanzeni TVET', 'TVET', 'Mbombela / KaNyamazane / Mlumati', 'Mpumalanga'),
    ('Gert Sibande TVET College', 'Gert Sibande TVET', 'TVET', 'Ermelo / Standerton / Evander', 'Mpumalanga'),
    ('Nkangala TVET College', 'Nkangala TVET', 'TVET', 'eMalahleni (Witbank) / Middelburg', 'Mpumalanga'),

    -- Remaining 24 South African Public Universities
    ('University of Johannesburg', 'UJ', 'Public University', 'Auckland Park / Doornfontein / Soweto', 'Gauteng'),
    ('University of the Witwatersrand', 'Wits', 'Public University', 'Braamfontein Campus, Johannesburg', 'Gauteng'),
    ('University of Pretoria', 'UP', 'Public University', 'Hatfield / Hillcrest / Groenkloof', 'Gauteng'),
    ('Sefako Makgatho Health Sciences University', 'SMU', 'Public University', 'Ga-Rankuwa, Pretoria', 'Gauteng'),
    ('Vaal University of Technology', 'VUT', 'Public University', 'Vanderbijlpark / Secunda', 'Gauteng'),
    ('University of South Africa', 'UNISA', 'Public University', 'Muckleneuk / Sunnyside / Regional', 'Gauteng'),

    ('University of Cape Town', 'UCT', 'Public University', 'Upper, Middle & Lower Campus, Rondebosch', 'Western Cape'),
    ('Stellenbosch University', 'SU', 'Public University', 'Stellenbosch / Tygerberg / Bellville', 'Western Cape'),
    ('University of the Western Cape', 'UWC', 'Public University', 'Bellville, Cape Town', 'Western Cape'),
    ('Cape Peninsula University of Technology', 'CPUT', 'Public University', 'Bellville / District Six / Mowbray', 'Western Cape'),

    ('University of KwaZulu-Natal', 'UKZN', 'Public University', 'Howard College / Westville / Pietermaritzburg', 'KwaZulu-Natal'),
    ('Durban University of Technology', 'DUT', 'Public University', 'Steve Biko / ML Sultan / Indumiso', 'KwaZulu-Natal'),
    ('Mangosuthu University of Technology', 'MUT', 'Public University', 'Umlazi, Durban', 'KwaZulu-Natal'),
    ('University of Zululand', 'UNIZULU', 'Public University', 'KwaDlangezwa / Richards Bay', 'KwaZulu-Natal'),

    ('North-West University', 'NWU', 'Public University', 'Potchefstroom / Mahikeng / Vaal Triangle', 'North West'),
    ('University of the Free State', 'UFS', 'Public University', 'Bloemfontein / Qwaqwa / South Campus', 'Free State'),
    ('Central University of Technology', 'CUT', 'Public University', 'Bloemfontein / Welkom', 'Free State'),

    ('Rhodes University', 'RU', 'Public University', 'Makhanda (Grahamstown)', 'Eastern Cape'),
    ('University of Fort Hare', 'UFH', 'Public University', 'Alice / East London / Bhisho', 'Eastern Cape'),
    ('Nelson Mandela University', 'NMU', 'Public University', 'Gqeberha (Port Elizabeth) / George', 'Eastern Cape'),
    ('Walter Sisulu University', 'WSU', 'Public University', 'Mthatha / East London / Butterworth', 'Eastern Cape'),

    ('University of Limpopo', 'UL', 'Public University', 'Turfloop Campus, Mankweng', 'Limpopo'),
    ('University of Venda', 'UNIVEN', 'Public University', 'Thohoyandou', 'Limpopo'),
    ('Sol Plaatje University', 'SPU', 'Public University', 'Kimberley', 'Northern Cape')
ON CONFLICT (name) DO NOTHING;

-- 3. Alter applications table to reference institution_id
DO $$
BEGIN
    -- Check if table public.applications exists, create if not present
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'applications') THEN
        CREATE TABLE public.applications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID,
            academic_year INT NOT NULL DEFAULT 2027,
            reference_number TEXT UNIQUE,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            id_number TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            student_number TEXT,
            preferred_residence TEXT NOT NULL,
            room_type TEXT NOT NULL DEFAULT 'Single Room',
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
        );
    END IF;
END $$;

-- Alter column to link institution_id foreign key
ALTER TABLE public.applications 
    ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) ON DELETE RESTRICT,
    ADD COLUMN IF NOT EXISTS other_institution_name TEXT,
    ADD COLUMN IF NOT EXISTS other_institution_campus TEXT,
    ADD COLUMN IF NOT EXISTS is_other_institution BOOLEAN DEFAULT FALSE NOT NULL;

-- Backfill default institution_id for existing records pointing to TUT or UMP
UPDATE public.applications
SET institution_id = (SELECT id FROM public.institutions WHERE short_name = 'TUT' LIMIT 1)
WHERE institution_id IS NULL AND is_other_institution = FALSE;

-- Ensure an index on applications(institution_id)
CREATE INDEX IF NOT EXISTS idx_applications_institution_id ON public.applications(institution_id);
