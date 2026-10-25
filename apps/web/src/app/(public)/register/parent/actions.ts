'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const ParentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().min(5, "Contact number is required"),
  location: z.string().min(2, "Country / City is required"),
  childName: z.string().optional(),
  childAge: z.coerce.number().optional(),
  program: z.string().optional(),
});

export async function registerParent(formData: FormData) {
  const supabase = await createClient()

  try {
    const rawData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      password: formData.get('password'),
      mobile: formData.get('mobile'),
      location: formData.get('location'),
      childName: formData.get('childName') || undefined,
      childAge: formData.get('childAge') ? Number(formData.get('childAge')) : undefined,
      program: formData.get('program') || undefined,
    };

    const parsed = ParentSchema.parse(rawData);

    const nameParts = parsed.fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Parent';
    const lastName = nameParts.slice(1).join(' ') || '';

    // 1. Create the user in Supabase Auth with 'parent' role
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: {
        data: {
          role: 'parent',
          first_name: firstName,
          last_name: lastName,
          mobile: parsed.mobile,
          location: parsed.location,
          child_name: parsed.childName,
          child_age: parsed.childAge,
          program: parsed.program,
        }
      }
    });

    if (authError || !authData.user) {
      console.error("[RegisterParent] Auth Error:", authError);
      redirect('/register/parent?error=' + encodeURIComponent(authError?.message || 'Could not create parent account'));
    }

    // Persist authenticated role cookie to prevent redirect loop / auth lockout
    try {
      const cookieStore = await cookies();
      cookieStore.set('demo_role', 'parent', { path: '/', maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set('demo_user', parsed.fullName, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    } catch (cookieErr) {
      console.warn("[RegisterParent] Cookie set warning:", cookieErr);
    }

    // 2. Ensure profile record is inserted with role 'parent'
    try {
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        role: 'parent',
        first_name: firstName,
        last_name: lastName,
        email: parsed.email,
      });
    } catch (dbErr) {
      console.warn("[RegisterParent] Profiles upsert error (non-fatal):", dbErr);
    }

    try {
      revalidatePath('/', 'layout');
    } catch {}

    redirect('/parent');
  } catch (err: unknown) {
    const errorObj = err as { digest?: string; message?: string };
    if (errorObj?.digest?.startsWith('NEXT_REDIRECT')) throw err;
    console.error("[RegisterParent] Unexpected error:", err);
    redirect('/register/parent?error=' + encodeURIComponent(errorObj?.message || 'Failed to complete registration'));
  }
}
