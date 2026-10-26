'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const RegisterSchema = z.object({
  role: z.enum(['student', 'parent', 'teacher']),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().optional(),
  location: z.string().optional(),

  // Student specific
  age: z.coerce.number().optional(),
  program: z.string().optional(),

  // Parent specific (Ward linkage)
  wardName: z.string().optional(),
  wardAge: z.coerce.number().optional(),
  wardCourse: z.string().optional(),
  wardId: z.string().optional(),

  // Teacher specific
  qualification: z.string().optional(),
  experience: z.string().optional(),
  maslak: z.string().optional(),
});

export async function registerUnifiedUser(formData: FormData) {
  const supabase = await createClient()

  try {
    const rawData = {
      role: formData.get('role') as string,
      fullName: (formData.get('fullName') as string || '').trim(),
      email: (formData.get('email') as string || '').trim().toLowerCase(),
      password: formData.get('password') as string,
      mobile: (formData.get('mobile') as string || '').trim() || undefined,
      location: (formData.get('location') as string || '').trim() || undefined,
      age: formData.get('age') ? Number(formData.get('age')) : undefined,
      program: (formData.get('program') as string || '').trim() || undefined,
      wardName: (formData.get('wardName') as string || '').trim() || undefined,
      wardAge: formData.get('wardAge') ? Number(formData.get('wardAge')) : undefined,
      wardCourse: (formData.get('wardCourse') as string || '').trim() || undefined,
      wardId: (formData.get('wardId') as string || '').trim() || undefined,
      qualification: (formData.get('qualification') as string || '').trim() || undefined,
      experience: (formData.get('experience') as string || '').trim() || undefined,
      maslak: (formData.get('maslak') as string || '').trim() || undefined,
    };

    const parsed = RegisterSchema.parse(rawData);

    const nameParts = parsed.fullName.split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || ' ';

    // Build custom user metadata for Supabase Auth
    const metadata: Record<string, any> = {
      role: parsed.role,
      first_name: firstName,
      last_name: lastName,
      full_name: parsed.fullName,
      mobile: parsed.mobile,
      location: parsed.location,
    };

    if (parsed.role === 'parent') {
      metadata.child_name = parsed.wardName;
      metadata.child_age = parsed.wardAge;
      metadata.program = parsed.wardCourse || parsed.program || 'Quran Reading & Tajweed';
      metadata.ward_id = parsed.wardId;
    } else if (parsed.role === 'student') {
      metadata.age = parsed.age;
      metadata.program = parsed.program || 'Kids Reading & Noorani Qaida';
    } else if (parsed.role === 'teacher') {
      metadata.qualification = parsed.qualification || 'Certified Quran Instructor';
      metadata.experience = parsed.experience;
      metadata.maslak = parsed.maslak || 'Sunni';
    }

    // 1. Supabase Auth signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: {
        data: metadata,
      },
    });

    if (authError || !authData.user) {
      console.error("[RegisterUnified] Auth Error:", authError);
      redirect('/register?error=' + encodeURIComponent(authError?.message || 'Could not create account'));
    }

    // 2. Set authoritative cookies for role, user, and linked ward
    try {
      const cookieStore = await cookies();
      cookieStore.set('demo_role', parsed.role, { path: '/', maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set('demo_user', parsed.fullName, { path: '/', maxAge: 60 * 60 * 24 * 7 });
      if (parsed.role === 'parent' && parsed.wardName) {
        cookieStore.set('selected_ward', parsed.wardName, { path: '/', maxAge: 60 * 60 * 24 * 7 });
      }
    } catch (cookieErr) {
      console.warn("[RegisterUnified] Cookie set warning:", cookieErr);
    }

    // 3. Upsert profiles record
    try {
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        role: parsed.role,
        first_name: firstName,
        last_name: lastName,
        email: parsed.email,
      });
    } catch (dbErr) {
      console.warn("[RegisterUnified] Profile upsert warning:", dbErr);
    }

    // 4. If parent linked a new or existing ward, associate with enrolments table
    if (parsed.role === 'parent' && parsed.wardName) {
      try {
        await supabase.from('enrolments').insert({
          learner_name: parsed.wardName,
          parent_name: parsed.fullName,
          age: parsed.wardAge || 10,
          programme: parsed.wardCourse || 'Quran Reading for Kids (Noorani Qaida)',
          email: parsed.email,
          phone: parsed.mobile || '',
          status: 'active',
          assessment_stage: 'Enrolled & Verified',
        });
      } catch (enrolErr) {
        console.warn("[RegisterUnified] Enrolment insertion warning:", enrolErr);
      }
    }

    try {
      revalidatePath('/', 'layout');
    } catch {}

    // 5. Navigate to the designated portal
    if (parsed.role === 'student') {
      redirect('/student');
    } else if (parsed.role === 'teacher') {
      redirect('/teacher');
    } else {
      redirect('/parent');
    }
  } catch (err: unknown) {
    const errorObj = err as { digest?: string; message?: string };
    if (errorObj?.digest?.startsWith('NEXT_REDIRECT')) throw err;
    console.error("[RegisterUnified] Unexpected error:", err);
    redirect('/register?error=' + encodeURIComponent(errorObj?.message || 'Failed to complete registration'));
  }
}
