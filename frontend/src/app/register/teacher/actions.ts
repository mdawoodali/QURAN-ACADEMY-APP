'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function registerTeacher(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const idCard = formData.get('idCard') as string;
  const address = formData.get('address') as string;
  const gender = formData.get('gender') as string;
  const age = parseInt(formData.get('age') as string);
  const qualification = formData.get('qualification') as string;
  const maslak = formData.get('maslak') as string;
  const bank = formData.get('bank') as string;

  const [firstName, ...lastNames] = fullName.split(' ');
  const lastName = lastNames.join(' ') || ' ';

  // 1. Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
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
    redirect('/register/teacher?error=Could not create account');
  }

  // 2. Insert into teacher_details table
  const { error: dbError } = await supabase.from('teacher_details').insert({
    id: authData.user.id,
    id_card_number: idCard,
    phone_number: email, // Fallback since we merged phone/email for simple auth
    address: address,
    qualification: qualification,
    maslak: maslak,
    fiqh: maslak, // Combine for now
    gender: gender,
    age: age,
    bank_account: bank,
    status: 'pending'
  });

  if (dbError) {
    console.error("DB Insert Error:", dbError);
  }

  // Teacher applications go to pending, but for the demo we'll let them into the dashboard
  redirect('/teacher')
}
