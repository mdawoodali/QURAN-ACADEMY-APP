'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

const TrialSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fatherName: z.string().min(1),
  age: z.coerce.number().int().positive(),
  timezone: z.string(),
  program: z.string(),
  email: z.string().email(),
  mobile: z.string().min(5),
  password: z.string().min(6),
  country: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1)
});

export async function submitTrialRegistration(rawData: Record<string, unknown>) {
  const supabase = await createClient()

  try {
    const parsed = TrialSchema.parse(rawData);

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: {
        data: {
          role: 'student',
          first_name: parsed.firstName,
          last_name: parsed.lastName,
          // Trial meta tracking
          trial_timezone: parsed.timezone,
          trial_program: parsed.program,
          mobile: parsed.mobile
        }
      }
    });

    if (authError || !authData.user) {
      return { error: authError?.message || 'Could not create account' }
    }

    // Persist authenticated role cookie to prevent redirect loop / auth lockout
    try {
      const cookieStore = await cookies();
      cookieStore.set('demo_role', 'student', { path: '/', maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set('demo_user', `${parsed.firstName} ${parsed.lastName}`.trim(), { path: '/', maxAge: 60 * 60 * 24 * 7 });
    } catch (cookieErr) {
      console.warn("[TrialRegistration] Cookie store access warning:", cookieErr);
    }

    // 2. Insert into student_details table (non-blocking if table is pending migration)
    try {
      const { error: dbError } = await supabase.from('student_details').insert({
        id: authData.user.id,
        father_name: parsed.fatherName,
        age: parsed.age,
        country: parsed.country,
        city: parsed.city,
        postal_code: '00000',
        address: `${parsed.address} | TZ: ${parsed.timezone} | Program: ${parsed.program}`
      });

      if (dbError) {
        console.warn("[TrialRegistration] student_details non-blocking notice:", dbError.message);
      }
    } catch (dbErr) {
      console.warn("[TrialRegistration] student_details insert error:", dbErr);
    }

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const issue = err.issues[0];
      const field = issue?.path?.join('.') || 'input';
      return { error: `Invalid ${field}: ${issue?.message || 'Please check your input'}` }
    }
    return { error: 'An unexpected error occurred' }
  }
}
