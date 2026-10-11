-- Course Modules & Curriculum Schema

-- 1. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL,
  target_age TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COURSE MODULES
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSE LESSONS (Sabaq / Rules / Topics)
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'lesson', -- 'foundation', 'rule', 'sabaq', 'sabqi', 'manzil'
  objectives TEXT[] DEFAULT '{}',
  content_summary TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENT COURSE ENROLMENTS & PROGRESS
CREATE TABLE IF NOT EXISTS student_enrolments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  current_module_id UUID REFERENCES course_modules(id),
  current_lesson_id UUID REFERENCES course_lessons(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'completed'
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS student_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  completed_at TIMESTAMPTZ,
  teacher_feedback TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  UNIQUE(student_id, lesson_id)
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Read policies: Courses, modules, and lessons are readable by all authenticated and anonymous users
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public courses read access' AND tablename = 'courses') THEN
    CREATE POLICY "Public courses read access" ON courses FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public course modules read access' AND tablename = 'course_modules') THEN
    CREATE POLICY "Public course modules read access" ON course_modules FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public course lessons read access' AND tablename = 'course_lessons') THEN
    CREATE POLICY "Public course lessons read access" ON course_lessons FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own enrolments' AND tablename = 'student_enrolments') THEN
    CREATE POLICY "Users can view own enrolments" ON student_enrolments FOR SELECT USING (auth.uid() = student_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own progress' AND tablename = 'student_lesson_progress') THEN
    CREATE POLICY "Users can view own progress" ON student_lesson_progress FOR SELECT USING (auth.uid() = student_id);
  END IF;
END $$;
