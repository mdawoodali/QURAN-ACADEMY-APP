-- ==============================================================================
-- Migration: High-Concurrency Composite Indexes & Immutable Audit Trail
-- Description: Optimizes real-time scheduling queries for 10,000+ concurrent
--              students and establishes an immutable, tamper-proof audit log
--              for regulatory compliance, scheduling alterations, and billing.
-- ==============================================================================

-- 1. High-Concurrency Composite Indexes
CREATE INDEX IF NOT EXISTS idx_class_sessions_perf_lookup 
  ON class_sessions(status, start_time, teacher_id, student_id);

CREATE INDEX IF NOT EXISTS idx_recurring_schedules_day_status
  ON recurring_schedules(day_of_week, status);

CREATE INDEX IF NOT EXISTS idx_session_attendance_student_created
  ON session_attendance_logs(student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_session_attendance_teacher_created
  ON session_attendance_logs(teacher_id, created_at DESC);

-- 2. Immutable Audit Trail Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for searching audit logs by entity and date
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_created ON audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created ON audit_logs(action, created_at DESC);

-- 3. Immutability Trigger (Prevent any UPDATE or DELETE operations)
CREATE OR REPLACE FUNCTION enforce_audit_log_immutability()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are strictly append-only and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_log_mutation ON audit_logs;
CREATE TRIGGER trg_prevent_audit_log_mutation
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION enforce_audit_log_immutability();

-- 4. Row Level Security for Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Service role and authenticated operations can insert audit logs
CREATE POLICY "System can record audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- 5. Double-Booking Prevention Unique Index (Prevents Concurrent Slot Collisions)
CREATE UNIQUE INDEX IF NOT EXISTS idx_prevent_teacher_double_booking 
  ON class_sessions (teacher_id, start_time) 
  WHERE status IN ('scheduled', 'live');

