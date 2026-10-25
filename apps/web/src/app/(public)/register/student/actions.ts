'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const StudentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  fatherName: z.string().min(2),
  age: z.number().int().positive(),
  location: z.string().min(2),
  address: z.string().min(5),
});

export async function registerStudent(formData: FormData) {
  const supabase = await createClient()

  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      fullName: formData.get('fullName'),
      fatherName: formData.get('fatherName'),
      age: parseInt(formData.get('age') as string || '0', 10),
      location: formData.get('location'),
      address: formData.get('address'),
    };

    const parsed = StudentSchema.parse(rawData);

    // Split location into country and city (basic fallback)
    const parts = parsed.location.split(',').map(s => s.trim());
    const country = parts[0] || 'Unknown';
    const city = parts.length > 1 ? parts[1] : 'Unknown';

    const [firstName, ...lastNames] = parsed.fullName.split(' ');
    const lastName = lastNames.join(' ') || ' ';

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: {
        data: {
          role: 'student',
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (authError || !authData.user) {
      console.error("Auth Error:", authError);
      redirect('/register/student?error=' + encodeURIComponent(authError?.message || 'Could not create account'));
    }

    // Persist authenticated role cookie to prevent redirect loop / auth lockout
    try {
      const cookieStore = await cookies();
      cookieStore.set('demo_role', 'student', { path: '/', maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set('demo_user', parsed.fullName, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    } catch (cookieErr) {
      console.warn("[RegisterStudent] Cookie set warning:", cookieErr);
    }

    // 2. Insert into student_details table (non-blocking if table is pending migration)
    try {
      const { error: dbError } = await supabase.from('student_details').insert({
        id: authData.user.id,
        father_name: parsed.fatherName,
        age: parsed.age,
        country: country,
        city: city,
        postal_code: '00000',
        address: parsed.address
      });

      if (dbError) {
        console.warn("[RegisterStudent] DB insert warning:", dbError.message);
      }
    } catch (dbErr) {
      console.warn("[RegisterStudent] DB insert exception:", dbErr);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("Validation Error:", err.message);
      const issue = err.issues[0];
      const field = issue?.path?.join('.') || 'input';
      redirect('/register/student?error=' + encodeURIComponent(`Invalid ${field}: ${issue?.message || 'Please check your input'}`));
    }
    throw err;
  }

  revalidatePath('/', 'layout');
  redirect('/student')
}
