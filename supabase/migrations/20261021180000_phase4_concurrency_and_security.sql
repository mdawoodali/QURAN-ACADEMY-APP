-- ==============================================================================
-- Migration: Phase 4 Concurrency Scaling, Database Indexing & Child Safety
-- Description: Composite indexing for 1,000+ concurrent classes, student double-booking
--              prevention, multi-currency invoices table with RLS, and child PII masking.
-- ==============================================================================

-- 1. Double-Booking Prevention Unique Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_prevent_teacher_double_booking 
  ON class_sessions (teacher_id, start_time) 
  WHERE status IN ('scheduled', 'live');

CREATE UNIQUE INDEX IF NOT EXISTS idx_prevent_student_double_booking 
  ON class_sessions (student_id, start_time) 
  WHERE status IN ('scheduled', 'live');

-- 2. High-Concurrency Composite Indexes for Real-Time Querying
CREATE INDEX IF NOT EXISTS idx_class_sessions_teacher_time_status 
  ON class_sessions (teacher_id, start_time, status);

CREATE INDEX IF NOT EXISTS idx_class_sessions_student_time_status 
  ON class_sessions (student_id, start_time, status);

CREATE INDEX IF NOT EXISTS idx_class_sessions_range_status 
  ON class_sessions (start_time, end_time, status);

-- 3. Multi-Currency Invoices Table (Zero-Stripe Direct Wire & Raast Reconciliation)
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL CHECK (currency IN ('PKR', 'GBP', 'USD', 'EUR', 'CAD', 'AUD')),
  status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'paid', 'refunded')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('raast', 'bank_wire', 'faster_payments', 'sepa', 'jazzcash', 'easypaisa', 'wise', 'paypal', 'payoneer')),
  transaction_ref TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  verified_at TIMESTAMPTZ
);

-- Invoices Indexes for Instant Administrative Reconciliation
CREATE INDEX IF NOT EXISTS idx_invoices_student_status ON invoices (student_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_parent_status ON invoices (parent_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_ref ON invoices (transaction_ref);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON invoices (created_at DESC);

-- 4. Row Level Security (RLS) for Invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Parents can view invoices for their own family
DROP POLICY IF EXISTS "Parents view own family invoices" ON invoices;
CREATE POLICY "Parents view own family invoices" ON invoices FOR SELECT
  USING (
    parent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM student_details
      WHERE student_details.id = invoices.student_id AND student_details.parent_id = auth.uid()
    )
  );

-- Students can view their own invoices
DROP POLICY IF EXISTS "Students view own invoices" ON invoices;
CREATE POLICY "Students view own invoices" ON invoices FOR SELECT
  USING (student_id = auth.uid());

-- Admins have full access to inspect, verify, and update invoices
DROP POLICY IF EXISTS "Admins full invoice access" ON invoices;
CREATE POLICY "Admins full invoice access" ON invoices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- System / Service role can insert new pending invoices
DROP POLICY IF EXISTS "System can record invoices" ON invoices;
CREATE POLICY "System can record invoices" ON invoices FOR INSERT
  WITH CHECK (true);

-- 5. Child Safety & COPPA Compliance: PII Masking Roster View
-- Ensures teachers only receive educational attributes (name, age, city)
-- without exposure to home address, phone numbers, or parental financial identifiers.
CREATE OR REPLACE VIEW safe_student_roster AS
SELECT 
  p.id AS student_id,
  p.first_name AS student_first_name,
  sd.age,
  sd.country,
  sd.city,
  p.created_at AS enrolled_since
FROM profiles p
JOIN student_details sd ON p.id = sd.id
WHERE p.role = 'student';
