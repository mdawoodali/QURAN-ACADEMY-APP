'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

// NOTE: Address, National ID, and IBAN/Bank restrictions are relaxed for testing mode.
// REMINDER: Restore production validation constraints when testing is complete.
const TeacherSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  idCard: z.string().optional().default("TEST-ID-PENDING"),
  address: z.string().optional().default("Testing Address"),
  gender: z.string().optional().default("Female"),
  age: z.number().int().optional().default(25),
  qualification: z.string().optional().default("Qari / Quran Teacher"),
  maslak: z.string().optional().default("General"),
  bank: z.string().optional().default("PK00TEST0000000000000000"),
});

export async function registerTeacher(formData: FormData) {
  const supabase = await createClient()

  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      fullName: formData.get('fullName'),
      idCard: formData.get('idCard') || "TEST-ID-PENDING",
      address: formData.get('address') || "Testing Address",
      gender: formData.get('gender') || "Female",
      age: parseInt(formData.get('age') as string || '25', 10),
      qualification: formData.get('qualification') || "Qari / Quran Teacher",
      maslak: formData.get('maslak') || "General",
      bank: formData.get('bank') || "PK00TEST0000000000000000",
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

    // Persist authenticated role cookie to prevent redirect loop / auth lockout
    try {
      const cookieStore = await cookies();
      cookieStore.set('demo_role', 'teacher', { path: '/', maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set('demo_user', parsed.fullName, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    } catch (cookieErr) {
      console.warn("[RegisterTeacher] Cookie set warning:", cookieErr);
    }

    // 2. Insert into teacher_details table (non-blocking if table is pending migration)
    try {
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
        console.warn("[RegisterTeacher] DB insert warning:", dbError.message);
      }
    } catch (dbErr) {
      console.warn("[RegisterTeacher] DB insert exception:", dbErr);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("Validation Error:", err.message);
      const issue = err.issues[0];
      const field = issue?.path?.join('.') || 'input';
      redirect('/register/teacher?error=' + encodeURIComponent(`Invalid ${field}: ${issue?.message || 'Please check your input'}`));
    }
    throw err;
  }

  revalidatePath('/', 'layout');
  // Teacher applications go to pending, but for evaluation and portal flow we proceed into the dashboard
  redirect('/teacher')
}
