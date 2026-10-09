'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // In a real app we'd handle this more gracefully, perhaps via useActionState
    console.error(error)
    redirect('/login?error=Could not authenticate user')
  }

  // Determine user role (simplistic approach based on email for demo)
  if (data.email.includes('admin')) {
    redirect('/admin')
  } else if (data.email.includes('teacher')) {
    redirect('/teacher')
  } else {
    redirect('/student')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error(error)
    redirect('/login?error=Could not create user')
  }

  // Determine user role (simplistic approach based on email for demo)
  if (data.email.includes('admin')) {
    redirect('/admin')
  } else if (data.email.includes('teacher')) {
    redirect('/teacher')
  } else {
    redirect('/student')
  }
}
