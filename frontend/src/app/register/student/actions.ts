'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function registerStudent(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const fatherName = formData.get('fatherName') as string;
  const age = parseInt(formData.get('age') as string);
  const location = formData.get('location') as string;
  const address = formData.get('address') as string;

  // Split location into country and city (basic fallback)
  const parts = location.split(',').map(s => s.trim());
  const country = parts[0] || 'Unknown';
  const city = parts.length > 1 ? parts[1] : 'Unknown';

  const [firstName, ...lastNames] = fullName.split(' ');
  const lastName = lastNames.join(' ') || ' ';

  // 1. Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
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
    redirect('/register/student?error=Could not create account');
  }

  // Note: The handle_new_user trigger automatically creates the `profiles` row.
  // 2. Insert into student_details table
  const { error: dbError } = await supabase.from('student_details').insert({
    id: authData.user.id,
    father_name: fatherName,
    age: age,
    country: country,
    city: city,
    postal_code: '00000', // Extract from address if needed
    address: address
  });

  if (dbError) {
    console.error("DB Insert Error:", dbError);
    // Continue anyway since auth succeeded (in a real app, handle rollback or upsert)
  }

  redirect('/student')
}
