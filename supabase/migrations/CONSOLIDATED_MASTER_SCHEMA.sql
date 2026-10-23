-- ==============================================================================
-- Quran Academy — Consolidated Master Production Database Schema
-- Description: Single, complete, idempotent schema script for Supabase SQL Editor.
--              Safe to run on a brand new or existing database.
-- ==============================================================================

-- 1. Create Enums if not already present
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'parent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE teacher_status AS ENUM ('pending', 'interview', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE class_status AS ENUM ('scheduled', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE schedule_day AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE schedule_status AS ENUM ('active', 'paused', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE livekit_session_status AS ENUM ('scheduled', 'live', 'completed', 'student_missed', 'teacher_missed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'student',
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Student Details Table
CREATE TABLE IF NOT EXISTS student_details (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  father_name TEXT NOT NULL DEFAULT '',
  age INTEGER NOT NULL DEFAULT 10,
  country TEXT NOT NULL DEFAULT 'United Kingdom',
  city TEXT NOT NULL DEFAULT 'London',
  postal_code TEXT NOT NULL DEFAULT '00000',
  address TEXT NOT NULL DEFAULT '',
  parent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Teacher Details Table
CREATE TABLE IF NOT EXISTS teacher_details (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  id_card_number TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  qualification TEXT NOT NULL,
  maslak TEXT DEFAULT 'Shia Ithna Ashari / Sunni Hanbali',
  fiqh TEXT DEFAULT 'Ja''fari / Hanafi',
  gender TEXT NOT NULL DEFAULT 'Male',
  age INTEGER NOT NULL DEFAULT 30,
  bank_account TEXT NOT NULL,
  status teacher_status DEFAULT 'approved',
  hourly_rate NUMERIC(10, 2) DEFAULT 12.00,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Courses & Curriculum Modules
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL,
  target_age TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'lesson',
  objectives TEXT[] DEFAULT '{}',
  content_summary TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_enrolments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  current_module_id UUID REFERENCES course_modules(id),
  current_lesson_id UUID REFERENCES course_lessons(id),
  status TEXT NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS student_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  completed_at TIMESTAMPTZ,
  teacher_feedback TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  UNIQUE(student_id, lesson_id)
);

-- 6. Teacher-Student Assignments
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

-- 7. Student Recurring Weekly Schedules
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

-- 8. Materialized Class Sessions (LiveKit Calendar Events)
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

-- 9. Attendance & Lesson Progress Logs
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

-- 10. Multi-Currency Direct Bank Transfer Invoices & Receipts
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  family_name TEXT NOT NULL DEFAULT 'Khan Family',
  package_id TEXT NOT NULL DEFAULT 'pkg_standard',
  package_name TEXT NOT NULL DEFAULT 'Standard Tajweed Plan',
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL CHECK (currency IN ('PKR', 'GBP', 'USD', 'EUR', 'CAD', 'AUD')),
  status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'paid', 'refunded', 'rejected')),
  payment_method TEXT NOT NULL DEFAULT 'Direct Bank Transfer',
  transaction_ref TEXT NOT NULL,
  receipt_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  verified_at TIMESTAMPTZ
);

-- 11. Immutable Audit Trail
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

-- 12. Composite Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON teacher_assignments(teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_assignments_student ON teacher_assignments(student_id, status);
CREATE INDEX IF NOT EXISTS idx_schedules_teacher_day ON recurring_schedules(teacher_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedules_student ON recurring_schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON class_sessions(session_date, status);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher_time ON class_sessions(teacher_id, start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_student_time ON class_sessions(student_id, start_time);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_ref ON invoices(transaction_ref);

-- 13. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 14. Policies (Idempotent Drops & Creates)
DROP POLICY IF EXISTS "Public view courses" ON courses;
CREATE POLICY "Public view courses" ON courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public view course modules" ON course_modules;
CREATE POLICY "Public view course modules" ON course_modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public view course lessons" ON course_lessons;
CREATE POLICY "Public view course lessons" ON course_lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role / Admin full access profiles" ON profiles;
CREATE POLICY "Service role / Admin full access profiles" ON profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role / Admin full access student_details" ON student_details;
CREATE POLICY "Service role / Admin full access student_details" ON student_details FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role / Admin full access teacher_details" ON teacher_details;
CREATE POLICY "Service role / Admin full access teacher_details" ON teacher_details FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role / Admin full access assignments" ON teacher_assignments;
CREATE POLICY "Service role / Admin full access assignments" ON teacher_assignments FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role / Admin full access schedules" ON recurring_schedules;
CREATE POLICY "Service role / Admin full access schedules" ON recurring_schedules FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role / Admin full access sessions" ON class_sessions;
CREATE POLICY "Service role / Admin full access sessions" ON class_sessions FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role / Admin full access invoices" ON invoices;
CREATE POLICY "Service role / Admin full access invoices" ON invoices FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role / Admin full access audit_logs" ON audit_logs;
CREATE POLICY "Service role / Admin full access audit_logs" ON audit_logs FOR ALL USING (true);

-- 15. Automatic User Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, first_name, last_name, email)
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student'::user_role),
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.email
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 16. Audit Log Immutability Protection Trigger
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
