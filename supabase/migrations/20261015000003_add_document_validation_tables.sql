-- ============================================================================
-- Migration: add_document_validation_tables.sql
-- Description: Automated document validation and fraud-detection pipeline table
--              with integrity flags, metadata heuristics, and cross-verification.
-- ============================================================================

-- 1. Create document validation status ENUM
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'doc_validation_status') THEN
        CREATE TYPE doc_validation_status AS ENUM ('processing', 'valid', 'flagged_mismatch', 'tampered', 'rejected');
    END IF;
END $$;

-- 2. Create application_documents table
CREATE TABLE IF NOT EXISTS public.application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('id_copy', 'proof_of_registration', 'funding_letter', 'lease_agreement')),
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes <= 5242880), -- 5MB limit
    mime_type TEXT NOT NULL CHECK (mime_type IN ('application/pdf', 'image/png', 'image/jpeg')),
    validation_status doc_validation_status DEFAULT 'processing' NOT NULL,
    validation_notes JSONB DEFAULT '{}'::jsonb NOT NULL,
    extracted_text TEXT,
    tamper_score NUMERIC(3, 2) DEFAULT 0.00,
    verified_at TIMESTAMPTZ,
    verified_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_app_docs_application_id ON public.application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_app_docs_status ON public.application_documents(validation_status);
CREATE INDEX IF NOT EXISTS idx_app_docs_type ON public.application_documents(document_type);

-- Full text search index on extracted OCR / PDF stream text
CREATE INDEX IF NOT EXISTS idx_app_docs_extracted_text ON public.application_documents USING gin(to_tsvector('english', COALESCE(extracted_text, '')));

-- 3. Row Level Security (RLS)
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

-- Students can insert and select documents where the application belongs to them
CREATE POLICY "Students can insert own application documents"
    ON public.application_documents
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.applications
            WHERE applications.id = application_documents.application_id
            AND applications.user_id = auth.uid()
        )
    );

CREATE POLICY "Students can view own application documents"
    ON public.application_documents
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.applications
            WHERE applications.id = application_documents.application_id
            AND applications.user_id = auth.uid()
        )
    );

-- Admins have full access to view, update status, and manage all documents
CREATE POLICY "Admins have full access to application documents table"
    ON public.application_documents
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
