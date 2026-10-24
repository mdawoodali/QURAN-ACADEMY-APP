-- ==============================================================================
-- Quran Academy — Production Master Seed Data
-- ==============================================================================

-- 1. Courses
INSERT INTO courses (id, slug, title, description, level, target_age)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'kids-reading-noorani-qaida', 'Quran Reading for Kids (Noorani Qaida)', 'Foundational Arabic phonetics, alphabet articulation, and word-formation.', 'Beginner', 'Ages 4-12'),
  ('c0000000-0000-0000-0000-000000000002', 'tajweed-fluency-recitation', 'Tajweed Fluency & Fluent Recitation', 'Comprehensive Makhaarij, Ghunnah, Ikhfa, and Qalqalah rule mastery.', 'Intermediate', 'All Ages'),
  ('c0000000-0000-0000-0000-000000000003', 'hifz-quran-memorisation', 'Hifz & Memorisation of the Holy Quran', 'Rigorous 3-tier memorisation pedagogy: Sabaq, Sabqi, and Manzil consolidation.', 'Advanced', 'All Ages')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

-- 2. System Settings
INSERT INTO settings (key, value, description)
VALUES 
  ('min_required_version', '1.1.0', 'Minimum supported app version across web, mobile and desktop'),
  ('app_latest_version', '1.1.0', 'Latest published version'),
  ('maintenance_mode', 'false', 'Global academy maintenance mode flag'),
  ('announcement_banner', 'Welcome to Quran Learn Academy — Term Enrollment Open', 'Academy broadcast message')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3. Invoices (Direct Remittance History)
INSERT INTO invoices (id, family_name, package_id, package_name, amount, currency, status, payment_method, transaction_ref, metadata)
VALUES
  ('rec_101', 'Ahmed Khan Family', 'pkg_standard', 'Standard Tajweed Plan (2 Learners • 3x/wk)', 18000.00, 'PKR', 'pending_verification', 'Meezan Bank Raast', 'RAAST-89213890', '{"studentName":"Yusuf & Hana Khan"}'::jsonb),
  ('rec_102', 'Tariq Hussain Family', 'pkg_essential', 'Essential Recitation (1 Learner • 2x/wk)', 65.00, 'GBP', 'pending_verification', 'UK Faster Payments (FPS)', 'FPS-BARC-77401928', '{"studentName":"Zayd Hussain"}'::jsonb),
  ('rec_103', 'Syed Raza Family', 'pkg_intensive', 'Intensive Hifz (2 Learners • 5x/wk)', 160.00, 'USD', 'paid', 'Domestic US ACH', 'ACH-CHAS-99201452', '{"studentName":"Ali & Fatimah Raza"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4. Enrolment Pipeline
INSERT INTO enrolments (id, learner_name, parent_name, email, phone, age, programme, matched_teacher, assessment_stage, status, country, city)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Yusuf Khan', 'Ahmed Khan', 'ahmed.khan@example.com', '+92 300 1234567', 9, 'Kids Reading & Noorani Qaida', 'Ustadha Maryam Ahmed', 'Beginner • Qaida Lesson 3', 'active', 'Pakistan', 'Lahore'),
  ('e0000000-0000-0000-0000-000000000002', 'Amina Khan', 'Ahmed Khan', 'ahmed.khan@example.com', '+44 7700 900123', 11, 'Tajweed Fluency & Recitation', 'Ustadha Maryam Ahmed', 'Intermediate • Makhaarij Evaluated', 'active', 'United Kingdom', 'London'),
  ('e0000000-0000-0000-0000-000000000003', 'Omar Ali', 'Farooq Ali', 'farooq.ali@example.com', '+1 214 555 0192', 14, 'Hifz & Memorisation', 'Sheikh Bilal Hassan', 'Revision Assessment (Juz 30)', 'placement_review', 'United States', 'Dallas'),
  ('e0000000-0000-0000-0000-000000000004', 'Zayd Farooq', 'Tariq Farooq', 'tariq.f@example.com', '+1 416 555 0184', 8, 'Kids Reading & Noorani Qaida', 'Ustadha Fatima Zahra', 'Free Trial Complete • Highly Recommended', 'awaiting_payment', 'Canada', 'Toronto'),
  ('e0000000-0000-0000-0000-000000000005', 'Maryam Rizvi', 'Baqir Rizvi', 'baqir.r@example.org', '+44 7911 123456', 10, 'Tajweed Fluency & Recitation', 'Sheikh Bilal Hassan', 'Trial Requested • Timezone UTC+1', 'trial_booked', 'United Kingdom', 'Birmingham')
ON CONFLICT (id) DO NOTHING;

-- 5. Uploaded Documents (Academy Reference Library)
INSERT INTO uploaded_documents (id, title, file_name, category, sect, file_size, uploaded_by, description)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Mafatih al-Jinan — Complete Classical Duas Compendium', 'Mafatih_al_Jinan_Full_Reader.pdf', 'Duas & Ziyarat', 'shia', '14.2 MB', 'Academy Super Admin', 'Standard verified Arabic diacritics and parallel English translation for major canonical supplications.'),
  ('d0000000-0000-0000-0000-000000000002', 'Noorani Qaida — Color-Coded Makhaarij Guide', 'Noorani_Qaida_Standard_Edition.pdf', 'Tajweed & Qaida', 'universal', '8.5 MB', 'Academy Super Admin', 'Foundational phonetics and letter-articulation reference used across beginner classrooms.'),
  ('d0000000-0000-0000-0000-000000000003', 'Al-Sahifa al-Sajjadiyya — The Psalms of Islam', 'Sahifa_Sajjadiyya_Manuscript.pdf', 'Classical Texts', 'shia', '18.7 MB', 'Academy Super Admin', 'Complete 54 supplications of Imam Ali Zayn al-Abidin (AS) with academic annotations.'),
  ('d0000000-0000-0000-0000-000000000004', 'Practical Ahkam & Daily Salat Manual', 'Practical_Ahkam_Salat_Handbook.pdf', 'Ahkam Fiqh', 'universal', '6.1 MB', 'Academy Super Admin', 'Step-by-step illustrated guide to Wudhu, Tayammum, and prayer actions according to verified jurisprudence.')
ON CONFLICT (id) DO NOTHING;

-- 6. Teacher Monthly Payouts
INSERT INTO teacher_payouts (id, teacher_name, period, completed_classes, hours, rate_per_class, adjustments, payable, currency, status, payout_date, reference)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Ustadha Maryam Ahmed', 'September 2026', 64, '32.0 hrs', 500.00, 0.00, 32000.00, 'PKR', 'Processing', '2026-11-01', 'PAY-2026-09-T1'),
  ('b0000000-0000-0000-0000-000000000002', 'Ustadha Maryam Ahmed', 'August 2026', 60, '30.0 hrs', 500.00, -500.00, 29500.00, 'PKR', 'Paid', '2026-09-01', 'PAY-2026-08-T1'),
  ('b0000000-0000-0000-0000-000000000003', 'Ustadha Maryam Ahmed', 'July 2026', 58, '29.0 hrs', 500.00, 0.00, 29000.00, 'PKR', 'Paid', '2026-08-01', 'PAY-2026-07-T1')
ON CONFLICT (reference) DO NOTHING;

-- 7. Student Lesson Progress Notes
INSERT INTO student_lesson_notes (student_name, teacher_name, lesson_date, lesson_title, grade, rating, feedback, homework, sabaq, sabqi, manzil, tajweed_score)
VALUES
  ('Yusuf Khan', 'Ustadha Maryam Ahmed', '2026-10-14', 'Lesson 3: Joined Letters & Throats', 'Excellent', 5, 'Yusuf did great today. Covered joined letter recognition with accuracy. Working on the throat letters (Khaa, Ghayn).', 'Practice Qaida page 12, focusing on the throat letters.', 'Joined letters with throat sounds (Ghayn, Khaa, Ayn, Haa)', 'Huruf Mufradaat (Isolated alphabet fluency)', 'Surah Al-Fatiha & Ayat al-Kursi recitation', '4.8 / 5.0'),
  ('Yusuf Khan', 'Ustadha Maryam Ahmed', '2026-10-11', 'Lesson 2: Heavy & Light Letters', 'Very Good', 4, 'Strong recollection of single alphabet sounds. Needs slightly thicker vibration on letter Saad.', 'Listen to audio guide and repeat 5 times.', 'Heavy letters (Saad, Dhad, Taa, Zhaa)', 'Alphabet sounds', 'Surah Al-Fatiha', '4.6 / 5.0'),
  ('Amina Khan', 'Ustadha Maryam Ahmed', '2026-10-13', 'Rules of Noon Sakinah & Tanween', 'Mastered', 5, 'Outstanding clarity on Idgham with Ghunnah.', 'Recite Surah Al-Qari''ah applying the rules.', 'Idgham with Ghunnah', 'Izhar rules', 'Juz 30 review', '5.0 / 5.0');
