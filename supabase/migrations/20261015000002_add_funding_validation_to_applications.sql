-- ============================================================================
-- Migration: add_funding_validation_to_applications.sql
-- Description: Structured Funding Type validation, constraints, and storage
--              policies for GKAS & HTS Residence student onboarding.
-- ============================================================================

-- 1. Create ENUM types for funding validation
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'funding_type') THEN
        CREATE TYPE funding_type AS ENUM ('nsfas', 'external_bursary', 'self_funded', 'student_loan');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'funding_verification_status') THEN
        CREATE TYPE funding_verification_status AS ENUM ('pending_verification', 'verified', 'rejected');
    END IF;
END $$;

-- 2. Update public.applications table with structured funding fields
ALTER TABLE public.applications
    ADD COLUMN IF NOT EXISTS funding_type funding_type NOT NULL DEFAULT 'nsfas',
    ADD COLUMN IF NOT EXISTS funding_status funding_verification_status NOT NULL DEFAULT 'pending_verification',
    ADD COLUMN IF NOT EXISTS bursary_sponsor_name TEXT,
    ADD COLUMN IF NOT EXISTS funding_reference_number TEXT,
    ADD COLUMN IF NOT EXISTS proof_of_funding_url TEXT,
    ADD COLUMN IF NOT EXISTS guardian_name TEXT,
    ADD COLUMN IF NOT EXISTS guardian_contact TEXT,
    ADD COLUMN IF NOT EXISTS funding_verified_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS funding_rejection_reason TEXT,
    ADD COLUMN IF NOT EXISTS funding_verified_by TEXT;

-- 3. Add CHECK constraints enforcing required fields per funding type
ALTER TABLE public.applications
    DROP CONSTRAINT IF EXISTS chk_external_bursary_sponsor,
    DROP CONSTRAINT IF EXISTS chk_self_funded_guardian;

ALTER TABLE public.applications
    ADD CONSTRAINT chk_external_bursary_sponsor 
    CHECK (
        funding_type != 'external_bursary' OR bursary_sponsor_name IS NOT NULL
    ),
    ADD CONSTRAINT chk_self_funded_guardian 
    CHECK (
        funding_type != 'self_funded' OR guardian_contact IS NOT NULL
    );

-- Index for admin filtering by funding verification status
CREATE INDEX IF NOT EXISTS idx_applications_funding_status ON public.applications(funding_status);
CREATE INDEX IF NOT EXISTS idx_applications_funding_type ON public.applications(funding_type);

-- 4. Supabase Storage: bucket 'application-documents' and RLS policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'application-documents',
    'application-documents',
    FALSE,
    5242880, -- 5 MB limit
    ARRAY['application/pdf', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE
SET file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf', 'image/png', 'image/jpeg'];

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Students can upload to their own application folder
CREATE POLICY "Students can upload own proof of funding"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'application-documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Policy: Students can view their own documents
CREATE POLICY "Students can read own proof of funding"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'application-documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Policy: Admins have full access to view and download all application documents
CREATE POLICY "Admins have full access to application documents"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (
        bucket_id = 'application-documents'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
