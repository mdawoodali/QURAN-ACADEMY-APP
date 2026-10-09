'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
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

    // Note: The handle_new_user trigger automatically creates the `profiles` row.
    // 2. Insert into student_details table
    const { error: dbError } = await supabase.from('student_details').insert({
      id: authData.user.id,
      father_name: parsed.fatherName,
      age: parsed.age,
      country: country,
      city: city,
      postal_code: '00000', // Extract from address if needed
      address: parsed.address
    });

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      redirect('/register/student?error=' + encodeURIComponent('Database error: ' + dbError.message));
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("Validation Error:", err.message);
      redirect('/register/student?error=Invalid+form+data');
    }
    throw err;
  }

  revalidatePath('/', 'layout');
  redirect('/student')
}
