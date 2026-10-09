'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const TeacherSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  idCard: z.string().min(5),
  address: z.string().min(5),
  gender: z.string(),
  age: z.number().int().min(18),
  qualification: z.string().min(2),
  maslak: z.string().min(2),
  bank: z.string().min(5),
});

export async function registerTeacher(formData: FormData) {
  const supabase = await createClient()

  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      fullName: formData.get('fullName'),
      idCard: formData.get('idCard'),
      address: formData.get('address'),
      gender: formData.get('gender'),
      age: parseInt(formData.get('age') as string || '0', 10),
      qualification: formData.get('qualification'),
      maslak: formData.get('maslak'),
      bank: formData.get('bank'),
    };

    const parsed = TeacherSchema.parse(rawData);

    const [firstName, ...lastNames] = parsed.fullName.split(' ');
    const lastName = lastNames.join(' ') || ' ';

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: {
        data: {
          role: 'teacher',
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (authError || !authData.user) {
      console.error("Auth Error:", authError);
      redirect('/register/teacher?error=' + encodeURIComponent(authError?.message || 'Could not create account'));
    }

    // 2. Insert into teacher_details table
    const { error: dbError } = await supabase.from('teacher_details').insert({
      id: authData.user.id,
      id_card_number: parsed.idCard,
      phone_number: parsed.email, // Fallback since we merged phone/email for simple auth
      address: parsed.address,
      qualification: parsed.qualification,
      maslak: parsed.maslak,
      fiqh: parsed.maslak, // Combine for now
      gender: parsed.gender,
      age: parsed.age,
      bank_account: parsed.bank,
      status: 'pending'
    });

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      redirect('/register/teacher?error=' + encodeURIComponent('Database error: ' + dbError.message));
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("Validation Error:", err.message);
      redirect('/register/teacher?error=Invalid+form+data');
    }
    throw err;
  }

  revalidatePath('/', 'layout');
  // Teacher applications go to pending, but for the demo we'll let them into the dashboard
  redirect('/teacher')
}
