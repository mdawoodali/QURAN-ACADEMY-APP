-- 1. Create Mock Users in auth.users
-- Since auth.users is managed by GoTrue, in local dev we can insert directly to bypass the API.
-- Passwords will be 'password123' encrypted by bcrypt.

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@quranacademy.com', crypt('password123', gen_salt('bf')), NOW(), '{"role":"admin","first_name":"Super","last_name":"Admin"}', NOW(), NOW(), 'authenticated', 'authenticated'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'teacher@quranacademy.com', crypt('password123', gen_salt('bf')), NOW(), '{"role":"teacher","first_name":"Maryam","last_name":"Ahmed"}', NOW(), NOW(), 'authenticated', 'authenticated'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'student@quranacademy.com', crypt('password123', gen_salt('bf')), NOW(), '{"role":"student","first_name":"Yusuf","last_name":"Khan"}', NOW(), NOW(), 'authenticated', 'authenticated');

-- Note: Our trigger "on_auth_user_created" will fire and insert into public.profiles for us!

-- 2. Populate Teacher Details
INSERT INTO public.teacher_details (id, id_card_number, phone_number, address, qualification, maslak, fiqh, gender, age, bank_account, status)
VALUES
('00000000-0000-0000-0000-000000000002', '12345-6789012-3', '+923001234567', 'Karachi, Pakistan', 'Qariah / Ijazah', 'Shia', 'Jafari', 'female', 28, 'PK12BANK000000123', 'approved');

-- Also add some pending teachers to test the Admin UI (we must insert into auth.users first, then trigger fires, then we insert details)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
VALUES
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'bilal@quranacademy.com', crypt('password123', gen_salt('bf')), NOW(), '{"role":"teacher","first_name":"Bilal","last_name":"Hassan"}', NOW(), NOW(), 'authenticated', 'authenticated'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'zain@quranacademy.com', crypt('password123', gen_salt('bf')), NOW(), '{"role":"teacher","first_name":"Zain","last_name":"Ali"}', NOW(), NOW(), 'authenticated', 'authenticated');

INSERT INTO public.teacher_details (id, id_card_number, phone_number, address, qualification, maslak, fiqh, gender, age, bank_account, status)
VALUES
('00000000-0000-0000-0000-000000000004', '98765-4321098-1', '+923009876543', 'Lahore, Pakistan', 'Hafiz', 'Shia', 'Jafari', 'male', 32, 'PK12BANK000000987', 'pending'),
('00000000-0000-0000-0000-000000000005', '56789-0123456-7', '+923005678901', 'Islamabad, Pakistan', 'Qari', 'Shia', 'Jafari', 'male', 25, 'PK12BANK000000567', 'pending');

-- 3. Populate Student Details
INSERT INTO public.student_details (id, father_name, age, country, city, postal_code, address)
VALUES
('00000000-0000-0000-0000-000000000003', 'Ahmed Khan', 9, 'Pakistan', 'Karachi', '75000', 'DHA Phase 6');

-- 4. Create sample classes (e.g. Yusuf takes Qaida with Maryam)
INSERT INTO public.classes (teacher_id, student_id, start_time, end_time, subject, status)
VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '2026-09-14 17:00:00+05', '2026-09-14 17:30:00+05', 'Qaida lesson 3', 'scheduled'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '2026-09-16 17:00:00+05', '2026-09-16 17:30:00+05', 'Qaida lesson 4', 'scheduled');
