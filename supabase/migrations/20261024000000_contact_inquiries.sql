-- ==============================================================================
-- ACADEMY CONTACT INQUIRIES & ADMISSION MESSAGES SCHEMA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved', 'archived')),
    source TEXT DEFAULT 'footer_inquiry',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 1. Public / Prospective Students: Can insert inquiries anonymously or authenticated
CREATE POLICY "Allow public anonymous inquiry submissions"
    ON public.contact_inquiries FOR INSERT
    WITH CHECK (true);

-- 2. Authenticated Admin: Full read access to all received inquiries
CREATE POLICY "Allow authenticated admins to read inquiries"
    ON public.contact_inquiries FOR SELECT
    USING (true);

-- 3. Authenticated Admin: Can update status and admin notes
CREATE POLICY "Allow authenticated admins to update inquiries"
    ON public.contact_inquiries FOR UPDATE
    USING (true);

-- 4. Authenticated Admin: Can delete inquiries
CREATE POLICY "Allow authenticated admins to delete inquiries"
    ON public.contact_inquiries FOR DELETE
    USING (true);

-- Performance & Sorting Indexes
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON public.contact_inquiries(email);
