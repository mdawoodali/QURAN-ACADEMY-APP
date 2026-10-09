-- Quran Academy Base Database Schema

-- ENUMS
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'parent');
CREATE TYPE teacher_status AS ENUM ('pending', 'interview', 'approved', 'rejected');
CREATE TYPE class_status AS ENUM ('scheduled', 'completed', 'cancelled');

-- 1. PROFILES TABLE (Extends auth.users)
-- Every user logging in gets a profile.
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STUDENT DETAILS
-- Matches PRD fields: Fathers’ name, Age, Country, City, Postal Code, Address.
CREATE TABLE student_details (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  father_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  address TEXT NOT NULL,
  parent_id UUID REFERENCES profiles(id) -- Links to a Parent profile for Family Dashboard
);

-- 3. TEACHER DETAILS
-- Matches PRD fields: ID card, phone, complete address, qualification, maslak, fiqh, gender, age, bank account.
CREATE TABLE teacher_details (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  id_card_number TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  qualification TEXT NOT NULL,
  maslak TEXT,
  fiqh TEXT,
  gender TEXT NOT NULL,
  age INTEGER NOT NULL,
  bank_account TEXT NOT NULL,
  status teacher_status DEFAULT 'pending',
  admin_notes TEXT
);

-- 4. CLASSES & SCHEDULING (For the Admin Master Calendar)
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES profiles(id) NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  subject TEXT NOT NULL,
  status class_status DEFAULT 'scheduled',
  zoom_or_meet_link TEXT, -- Fallback, though we will build our own classroom UI
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROGRESS & LESSON NOTES
CREATE TABLE lesson_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) NOT NULL,
  teacher_id UUID REFERENCES profiles(id) NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  covered_topic TEXT NOT NULL,
  performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 5),
  homework TEXT,
  teacher_remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;

-- Basic Profile RLS: Users can read their own profile. Admins can read all.
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, first_name, last_name, email)
  VALUES (
    new.id, 
    -- Default to student if not provided in metadata
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student'::user_role),
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
