'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const TrialSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fatherName: z.string().min(1),
  age: z.coerce.number().int().positive(),
  timezone: z.string(),
  program: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  country: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1)
});

export async function submitTrialRegistration(rawData: Record<string, any>) {
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
          trial_program: parsed.program
        }
      }
    });

    if (authError || !authData.user) {
      return { error: authError?.message || 'Could not create account' }
    }

    // 2. Insert into student_details table
    // Incorporating timezone and program into address field since our DB schema hasn't expanded yet
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
      return { error: 'Database error: ' + dbError.message }
    }

    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: 'Invalid form data' }
    }
    return { error: 'An unexpected error occurred' }
  }
}
