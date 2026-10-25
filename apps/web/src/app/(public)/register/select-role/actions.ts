'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function confirmRole(formData: FormData) {
  const role = (formData.get('role') as string || 'student').trim().toLowerCase();
  const validRoles = ['student', 'parent', 'teacher'];
  const finalRole = validRoles.includes(role) ? role : 'student';

  const supabase = await createClient();
  const cookieStore = await cookies();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 1. Update user metadata
      await supabase.auth.updateUser({
        data: { role: finalRole }
      });

      // 2. Upsert profile record
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      const [firstName, ...rest] = name.split(' ');
      const lastName = rest.join(' ') || '';

      await supabase.from('profiles').upsert({
        id: user.id,
        role: finalRole,
        email: user.email,
        first_name: firstName,
        last_name: lastName,
      });

      cookieStore.set('demo_user', name, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    }
  } catch (err) {
    console.warn("[ConfirmRole] Supabase profile update error:", err);
  }

  cookieStore.set('demo_role', finalRole, { path: '/', maxAge: 60 * 60 * 24 * 7 });

  try {
    revalidatePath('/', 'layout');
  } catch {}

  if (finalRole === 'parent') redirect('/parent');
  if (finalRole === 'teacher') redirect('/teacher');
  redirect('/student');
}
