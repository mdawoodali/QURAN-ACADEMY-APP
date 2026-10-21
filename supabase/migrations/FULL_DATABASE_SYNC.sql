-- ==============================================================================
-- Quran Academy - Consolidated Full Production Database Sync
-- Description: Idempotent script for Supabase SQL Editor.
--              Safe to run multiple times without data loss or collision.
-- ==============================================================================

-- 1. Create Enums if not already present
DO $$ BEGIN
  CREATE TYPE schedule_day AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE schedule_status AS ENUM ('active', 'paused', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE livekit_session_status AS ENUM ('scheduled', 'live', 'completed', 'student_missed', 'teacher_missed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Teacher-Student Assignments
CREATE TABLE IF NOT EXISTS teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL DEFAULT 'Tajweed & Fluent Recitation',
  package_tier TEXT DEFAULT 'Standard',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'reassigned', 'terminated')),
  assigned_by UUID REFERENCES profiles(id),
  assignment_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_teacher_student_subject UNIQUE (teacher_id, student_id, subject)
);

-- 3. Student Recurring Weekly Schedules
CREATE TABLE IF NOT EXISTS recurring_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES teacher_assignments(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week schedule_day NOT NULL,
  start_time_local TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30 CHECK (duration_minutes IN (30, 45, 60)),
  timezone_anchor TEXT NOT NULL DEFAULT 'Asia/Karachi',
  status schedule_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Materialized Class Sessions (Individual lessons on calendar)
CREATE TABLE IF NOT EXISTS class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recurring_schedule_id UUID REFERENCES recurring_schedules(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  subject TEXT NOT NULL,
  status livekit_session_status DEFAULT 'scheduled',
  livekit_room_name TEXT UNIQUE NOT NULL,
  recording_url TEXT,
  attendance_logged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Session Attendance & Performance Log
CREATE TABLE IF NOT EXISTS session_attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES class_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_joined_at TIMESTAMPTZ,
  student_left_at TIMESTAMPTZ,
  teacher_joined_at TIMESTAMPTZ,
  teacher_left_at TIMESTAMPTZ,
  duration_minutes_effective INTEGER DEFAULT 0,
  surah_practiced TEXT,
  ayah_start INTEGER,
  ayah_end INTEGER,
  tajweed_rating INTEGER CHECK (tajweed_rating >= 1 AND tajweed_rating <= 5),
  homework_assigned TEXT,
  teacher_private_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Immutable Audit Trail Table
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

-- 7. High-Concurrency Composite Indexes
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON teacher_assignments(teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_assignments_student ON teacher_assignments(student_id, status);
CREATE INDEX IF NOT EXISTS idx_schedules_teacher_day ON recurring_schedules(teacher_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedules_student ON recurring_schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_recurring_schedules_day_status ON recurring_schedules(day_of_week, status);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON class_sessions(session_date, status);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher_time ON class_sessions(teacher_id, start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_student_time ON class_sessions(student_id, start_time);
CREATE INDEX IF NOT EXISTS idx_class_sessions_perf_lookup ON class_sessions(status, start_time, teacher_id, student_id);
CREATE INDEX IF NOT EXISTS idx_session_attendance_student_created ON session_attendance_logs(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_attendance_teacher_created ON session_attendance_logs(teacher_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_created ON audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created ON audit_logs(action, created_at DESC);

-- 8. Double-Booking Prevention Unique Indexes (Race condition protection)
CREATE UNIQUE INDEX IF NOT EXISTS idx_prevent_teacher_double_booking 
  ON class_sessions (teacher_id, start_time) 
  WHERE status IN ('scheduled', 'live');

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'classes') THEN
    CREATE UNIQUE INDEX IF NOT EXISTS idx_prevent_classes_double_booking
      ON classes (teacher_id, start_time)
      WHERE status = 'scheduled';
  END IF;
END $$;

-- 9. Immutability Trigger for Audit Logs
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

-- 10. Enable Row Level Security (RLS)
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 11. Security Policies (Drop & Recreate for safe idempotency)
DROP POLICY IF EXISTS "Admins full access on assignments" ON teacher_assignments;
CREATE POLICY "Admins full access on assignments" ON teacher_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Admins full access on schedules" ON recurring_schedules;
CREATE POLICY "Admins full access on schedules" ON recurring_schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Admins full access on sessions" ON class_sessions;
CREATE POLICY "Admins full access on sessions" ON class_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Teachers view their assignments" ON teacher_assignments;
CREATE POLICY "Teachers view their assignments" ON teacher_assignments FOR SELECT USING (
  teacher_id = auth.uid()
);

DROP POLICY IF EXISTS "Teachers view their schedules" ON recurring_schedules;
CREATE POLICY "Teachers view their schedules" ON recurring_schedules FOR SELECT USING (
  teacher_id = auth.uid()
);

DROP POLICY IF EXISTS "Teachers view and update their sessions" ON class_sessions;
CREATE POLICY "Teachers view and update their sessions" ON class_sessions FOR ALL USING (
  teacher_id = auth.uid()
);

DROP POLICY IF EXISTS "Students view their assignments" ON teacher_assignments;
CREATE POLICY "Students view their assignments" ON teacher_assignments FOR SELECT USING (
  student_id = auth.uid()
);

DROP POLICY IF EXISTS "Students view their schedules" ON recurring_schedules;
CREATE POLICY "Students view their schedules" ON recurring_schedules FOR SELECT USING (
  student_id = auth.uid()
);

DROP POLICY IF EXISTS "Students view their sessions" ON class_sessions;
CREATE POLICY "Students view their sessions" ON class_sessions FOR SELECT USING (
  student_id = auth.uid()
);

DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "System can record audit logs" ON audit_logs;
CREATE POLICY "System can record audit logs" ON audit_logs FOR INSERT WITH CHECK (true);
