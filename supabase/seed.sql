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


-- 5. COURSE MODULES & SYLLABUS SEEDING

INSERT INTO public.courses (id, slug, title, description, level, target_age)
VALUES
('c0000000-0000-0000-0000-000000000001', 'noorani-qaida', 'Noorani Qaida Foundations', 'Foundational Arabic letters, sounds, and joining rules for absolute beginners.', 'Level 1 · Beginner', 'Ages 4-16'),
('c0000000-0000-0000-0000-000000000002', 'tajweed-fluent-recitation', 'Tajweed & Fluent Recitation', 'Comprehensive Tajweed rules, correct articulation (Makhaarij), and melodic fluency with certified teachers.', 'Level 2 · Intermediate', 'All Ages'),
('c0000000-0000-0000-0000-000000000003', 'hifz-memorisation', 'Hifz — Quran Memorisation (Daily Sabaq System)', 'Structured, revision-focused memorisation using the proven 3-pillar method: Sabaq, Sabqi, and Manzil.', 'Level 3 · Advanced', 'Ages 6+')
ON CONFLICT (slug) DO NOTHING;

-- MODULES FOR NOORANI QAIDA
INSERT INTO public.course_modules (id, course_id, title, description, order_index)
VALUES
('m1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Module 1: Arabic Letter Foundations & Recognition', 'Recognizing individual and compound letter forms with their visual variations.', 1),
('m1000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Module 2: Harakat & Short Vowels', 'Mastering Fathah, Kasrah, and Dammah with accurate vocalization.', 2),
('m1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Module 3: Tanween & Vowel Doubling', 'Rules and pronunciation of double short vowels (Two Zabar, Two Zair, Two Paish).', 3),
('m1000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Module 4: Maddah, Leen & Sukoon (Jazm)', 'Long vowels, soft letters, and resting consonants.', 4),
('m1000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'Module 5: Tashdeed (Shaddah) & Word Synthesis', 'Doubled consonants and smooth word synthesis for reading preparation.', 5)
ON CONFLICT (id) DO NOTHING;

-- LESSONS FOR NOORANI QAIDA
INSERT INTO public.course_lessons (id, module_id, title, plan_type, objectives, content_summary, order_index)
VALUES
('l1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', 'Huruf Mufradaat (Isolated Letters)', 'foundation', ARRAY['Recognize 29 Arabic letters', 'Differentiate similar letter shapes', 'Correct baseline pronunciation'], 'Pronunciation and recognition of single letters from Alif to Yaa.', 1),
('l1000000-0000-0000-0000-000000000002', 'm1000000-0000-0000-0000-000000000001', 'Huruf Murakkabaat (Compound / Joined Letters)', 'foundation', ARRAY['Identify initial, medial, and final letter shapes', 'Spot dot placement (Nuqta)'], 'Reading two-letter and three-letter joined combinations.', 2),
('l1000000-0000-0000-0000-000000000003', 'm1000000-0000-0000-0000-000000000001', 'Huruf Muqatta''at (Disjointed Letters)', 'foundation', ARRAY['Pronounce opening Surah initials', 'Maintain distinct letter names'], 'Reciting isolated letter combinations appearing at the starts of Surahs.', 3),
('l1000000-0000-0000-0000-000000000004', 'm1000000-0000-0000-0000-000000000002', 'Harakat (Fathah, Kasrah, Dammah)', 'foundation', ARRAY['Produce short vowel sounds without elongation', 'Avoid Jhatka (jerking) sounds'], 'Learning short vowel movements on single consonants.', 4),
('l1000000-0000-0000-0000-000000000005', 'm1000000-0000-0000-0000-000000000003', 'Tanween (Double Vowels)', 'foundation', ARRAY['Understand hidden Noon sound', 'Pronounce Do Zabar, Do Zair, Do Paish'], 'Pronouncing the Nunated endings with smooth transitions.', 5),
('l1000000-0000-0000-0000-000000000006', 'm1000000-0000-0000-0000-000000000004', 'Huruf Maddah & Khari Harakat', 'foundation', ARRAY['Elongate long vowels by 1 Alif (2 counts)', 'Differentiate Standing Fathah/Kasrah/Dammah'], 'Alif Maddah, Waw Maddah, Yaa Maddah and vertical vowel strokes.', 6),
('l1000000-0000-0000-0000-000000000007', 'm1000000-0000-0000-0000-000000000004', 'Huruf Leen (Soft Letters)', 'foundation', ARRAY['Pronounce Waw Leen and Yaa Leen smoothly', 'Prevent excessive stretching'], 'Soft letters preceded by Fathah.', 7),
('l1000000-0000-0000-0000-000000000008', 'm1000000-0000-0000-0000-000000000004', 'Sukoon / Jazm (Resting Letters)', 'foundation', ARRAY['Connect active letter with resting letter', 'Avoid vowel creeping on Sakin letters'], 'Reading consonants bearing a Sukoon.', 8),
('l1000000-0000-0000-0000-000000000009', 'm1000000-0000-0000-0000-000000000005', 'Tashdeed (Doubled Consonants)', 'foundation', ARRAY['Hold doubled consonants firmly', 'Pronounce Shaddah without pausing'], 'Doubled consonant rules and practice with connected words.', 9),
('l1000000-0000-0000-0000-000000000010', 'm1000000-0000-0000-0000-000000000005', 'Tashdeed with Sukoon and Madd Exercises', 'foundation', ARRAY['Read multi-syllable compounds', 'Synthesize full words fluidly'], 'Final synthesis exercises preparing students to read the Holy Quran directly.', 10)
ON CONFLICT (id) DO NOTHING;

-- MODULES FOR TAJWEED & FLUENT RECITATION
INSERT INTO public.course_modules (id, course_id, title, description, order_index)
VALUES
('m2000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Module 1: Makhaarij (Points of Articulation)', 'Accurate anatomical origin of every Arabic letter.', 1),
('m2000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Module 2: Sifaat al-Huroof (Letter Characteristics)', 'Intrinsic qualities including heavy/light sounds, whisper, and echo.', 2),
('m2000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'Module 3: Rules of Noon Sakinah & Tanween', 'The four core rules: Izhaar, Idghaam, Iqlab, and Ikhfa.', 3),
('m2000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'Module 4: Rules of Meem Sakinah & Raa/Laam Rules', 'Rules governing resting Meem, heavy and light Raa, and Lafz al-Jalalah.', 4),
('m2000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'Module 5: Ahkaam al-Madd & Waqf (Elongation & Stopping)', 'Natural and secondary Madd counts and stopping etiquette.', 5)
ON CONFLICT (id) DO NOTHING;

-- LESSONS FOR TAJWEED
INSERT INTO public.course_lessons (id, module_id, title, plan_type, objectives, content_summary, order_index)
VALUES
('l2000000-0000-0000-0000-000000000001', 'm2000000-0000-0000-0000-000000000001', 'Makharij: Throat Letters (Halqiyyah)', 'rule', ARRAY['Isolate Top, Middle, and Bottom throat points', 'Pronounce Hamzah, Haa, Ayn, Haa, Ghayn, Khaa accurately'], 'Detailed study of the six throat letters and articulation points.', 1),
('l2000000-0000-0000-0000-000000000002', 'm2000000-0000-0000-0000-000000000001', 'Makharij: Tongue, Lips & Nasal Cavity', 'rule', ARRAY['Tongue tip and edges articulation', 'Two lips (Shafataan) letters', 'Khayshoom (nasal sound)'], 'Detailed study of the tongue (Lahwiyyah, Shajariyyah, Tarfiyyah) and lip letters.', 2),
('l2000000-0000-0000-0000-000000000003', 'm2000000-0000-0000-0000-000000000002', 'Sifaat: Qalqalah & Hams', 'rule', ARRAY['Execute bouncing echo on Qaf, Taa, Baa, Jeem, Daal', 'Control air flow in whispered letters'], 'The five Qalqalah letters in light, medium, and heavy stopping states.', 3),
('l2000000-0000-0000-0000-000000000004', 'm2000000-0000-0000-0000-000000000002', 'Sifaat: Tafkheem (Heavy) & Tarqeeq (Light)', 'rule', ARRAY['Elevate back of tongue for Isti''la letters', 'Maintain flat tongue for Istifal letters'], 'The seven permanently heavy letters (Khus Sa-ghtin Qiz) versus light letters.', 4),
('l2000000-0000-0000-0000-000000000005', 'm2000000-0000-0000-0000-000000000003', 'Izhaar Halqi (Clear Pronunciation)', 'rule', ARRAY['Pronounce Noon clearly before throat letters', 'Prevent Ghunnah during Izhaar'], 'Rules and examples of Izhaar with throat letters.', 5),
('l2000000-0000-0000-0000-000000000006', 'm2000000-0000-0000-0000-000000000003', 'Idghaam (Merging with & without Ghunnah)', 'rule', ARRAY['Merge into Yarmaloon letters', 'Apply 2-count nasal Ghunnah on Yanmoo letters', 'Complete merge on Laam and Raa'], 'Rules of Idghaam Bi-Ghunnah and Idghaam Bila-Ghunnah.', 6),
('l2000000-0000-0000-0000-000000000007', 'm2000000-0000-0000-0000-000000000003', 'Iqlab (Conversion into Meem)', 'rule', ARRAY['Convert Noon Sakinah/Tanween into Meem before Baa', 'Light lip contact with 2-count Ghunnah'], 'Mechanics of Iqlab with practical application.', 7),
('l2000000-0000-0000-0000-000000000008', 'm2000000-0000-0000-0000-000000000003', 'Ikhfa Haqiqi (Concealment with Ghunnah)', 'rule', ARRAY['Conceal Noon sound before the 15 Ikhfa letters', 'Produce heavy Ghunnah before heavy letters'], 'The 15 letters of Ikhfa and distinguishing heavy/light nasalization.', 8),
('l2000000-0000-0000-0000-000000000009', 'm2000000-0000-0000-0000-000000000004', 'Ahkaam Meem Sakinah & Rules of Raa', 'rule', ARRAY['Master Ikhfa Shafawi, Idghaam Shafawi, Izhaar Shafawi', 'Apply Tafkheem and Tarqeeq on letter Raa'], 'Rules for resting Meem and conditional heaviness of Raa.', 9),
('l2000000-0000-0000-0000-000000000010', 'm2000000-0000-0000-0000-000000000005', 'Ahkaam al-Madd (Elongations) & Waqf', 'rule', ARRAY['Differentiate Madd Muttasil (4-5 counts) & Munfasil', 'Apply Madd Laazim (6 counts)', 'Recognize stopping symbols (Meem, Qaly, Saly, Jeem)'], 'Classification of Madd types and Waqf (stopping) rules.', 10)
ON CONFLICT (id) DO NOTHING;

-- MODULES FOR HIFZ (MEMORISATION) - DAILY SABAQ SYSTEM
INSERT INTO public.course_modules (id, course_id, title, description, order_index)
VALUES
('m3000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Module 1: The Three Pillars of Hifz Architecture', 'Foundational operational framework: Sabaq, Sabqi, and Manzil.', 1),
('m3000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'Module 2: Daily Sabaq Protocol & Ayah Retention Drills', 'Step-by-step memorisation methodology from audio prep to teacher submission.', 2),
('m3000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Module 3: Sabqi / Dhor (Recent Revision System)', 'Strengthening new memorisation over a rolling 10-day retention window.', 3),
('m3000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', 'Module 4: Manzil (Long-Term Retention & Permanent Cycle)', 'Systematic rotating review of all completed Ajzaa to ensure zero attrition.', 4),
('m3000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', 'Module 5: Hifz Assessment, Mutashabihat & Exam Prep', 'Managing similar verses (Mutashabihat) and formal evaluations.', 5)
ON CONFLICT (id) DO NOTHING;

-- LESSONS FOR HIFZ
INSERT INTO public.course_lessons (id, module_id, title, plan_type, objectives, content_summary, order_index)
VALUES
('l3000000-0000-0000-0000-000000000001', 'm3000000-0000-0000-0000-000000000001', 'Introduction to the 3-Pillar Daily System', 'sabaq', ARRAY['Define Sabaq (New), Sabqi (Recent), and Manzil (Old)', 'Structure daily 90-minute study allocation', 'Establish consistent Mushaf print selection'], 'Overview of the proven Ottoman/Subcontinent Hifz methodology.', 1),
('l3000000-0000-0000-0000-000000000002', 'm3000000-0000-0000-0000-000000000002', 'Daily Sabaq Preparation: Audio & Pronunciation Check', 'sabaq', ARRAY['Listen to certified Qari recitation 3x before memorising', 'Pre-read target page with teacher to eliminate errors'], 'Step 1 of the daily Sabaq cycle ensuring flawless Tajweed prior to memory commitment.', 2),
('l3000000-0000-0000-0000-000000000003', 'm3000000-0000-0000-0000-000000000002', 'The 20x Linking Repetition Drill for Sabaq', 'sabaq', ARRAY['Memorise Ayah by Ayah with 20 repetitions', 'Link consecutive Ayahs (1+2, 2+3, 1+2+3)', 'Recite full Sabaq from memory 5 times without looking'], 'Standard operational procedure for committing a new quarter/half page daily.', 3),
('l3000000-0000-0000-0000-000000000004', 'm3000000-0000-0000-0000-000000000002', 'Daily Sabaq Teacher Submission Protocol', 'sabaq', ARRAY['Recite new Sabaq to teacher with zero mistakes permitted', 'Record hesitation count and pronunciation accuracy'], 'Live classroom submission standards for marking Sabaq as approved.', 4),
('l3000000-0000-0000-0000-000000000005', 'm3000000-0000-0000-0000-000000000003', 'Sabqi Routine: Rolling 1-Juz Revision', 'sabqi', ARRAY['Recite last 5 to 10 pages completed', 'Reinforce the current active Juz', 'Target zero hesitation on page transitions'], 'Sabqi protocol: cementing newly formed memories before they transfer to long-term storage.', 5),
('l3000000-0000-0000-0000-000000000006', 'm3000000-0000-0000-0000-000000000003', 'Weekly Sabqi Consolidation & Threshold Test', 'sabqi', ARRAY['Test entire current Juz in a single sitting', 'Achieve 95%+ accuracy before unlocking the next Juz'], 'Milestone testing for moving from one Juz to the next.', 6),
('l3000000-0000-0000-0000-000000000007', 'm3000000-0000-0000-0000-000000000004', 'Manzil Rotation: Daily Old Revision Plan', 'manzil', ARRAY['Recite half Juz to 1 full Juz daily from older Ajzaa', 'Maintain a 30-day full Quran completion cycle', 'Pair revision with prayer recitation (Salah)'], 'Manzil methodology: ensuring older memorization remains rock-solid for life.', 7),
('l3000000-0000-0000-0000-000000000008', 'm3000000-0000-0000-0000-000000000005', 'Mutashabihat Management (Similar Verses)', 'sabaq', ARRAY['Identify cross-Surah phrasing similarities', 'Use indexing notes and visual layout anchors'], 'Techniques for mastering similar verses that frequently cause confusion in Hifz.', 8),
('l3000000-0000-0000-0000-000000000009', 'm3000000-0000-0000-0000-000000000005', 'Hifz Performance Metrics & Monthly Progress Review', 'sabaq', ARRAY['Evaluate weekly Sabaq velocity (pages/week)', 'Track Sabqi retention index and Manzil consistency'], 'Systematic evaluation metrics for teachers and parents.', 9)
ON CONFLICT (id) DO NOTHING;

-- 6. ENROL SAMPLE STUDENT INTO COURSES
INSERT INTO public.student_enrolments (student_id, course_id, current_module_id, current_lesson_id, status)
VALUES
('00000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000003', 'active'),
('00000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'm2000000-0000-0000-0000-000000000003', 'l2000000-0000-0000-0000-000000000008', 'active'),
('00000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'm3000000-0000-0000-0000-000000000002', 'l3000000-0000-0000-0000-000000000003', 'active')
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Insert sample lesson progress for student Yusuf Khan
INSERT INTO public.student_lesson_progress (student_id, lesson_id, status, completed_at, score, teacher_feedback)
VALUES
('00000000-0000-0000-0000-000000000003', 'l1000000-0000-0000-0000-000000000001', 'completed', NOW() - INTERVAL '7 days', 95, 'Excellent letter shape recognition.'),
('00000000-0000-0000-0000-000000000003', 'l1000000-0000-0000-0000-000000000002', 'completed', NOW() - INTERVAL '5 days', 90, 'Good grasp of compound letters.'),
('00000000-0000-0000-0000-000000000003', 'l1000000-0000-0000-0000-000000000003', 'in_progress', NULL, NULL, 'Currently practicing isolated opening Surah letters.'),
('00000000-0000-0000-0000-000000000005', 'l2000000-0000-0000-0000-000000000005', 'completed', NOW() - INTERVAL '3 days', 92, 'Clear throat letter pronunciation.'),
('00000000-0000-0000-0000-000000000006', 'l2000000-0000-0000-0000-000000000006', 'completed', NOW() - INTERVAL '2 days', 88, 'Good Ghunnah timing on Idghaam.')
ON CONFLICT (student_id, lesson_id) DO NOTHING;
