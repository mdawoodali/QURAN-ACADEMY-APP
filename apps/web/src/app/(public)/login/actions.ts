'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const email = (formData.get('email') as string || '').trim().toLowerCase()
  const password = (formData.get('password') as string || '')
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isDummyConfig =
    !supabaseUrl ||
    !supabaseKey ||
    supabaseKey.includes('dummy') ||
    supabaseUrl.includes('127.0.0.1') ||
    supabaseUrl.includes('localhost')

  // Attempt real cloud authentication if live Supabase is configured
  if (!isDummyConfig) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
      }
    } catch (err: unknown) {
      const errorObj = err as { digest?: string; message?: string }
      if (errorObj?.digest?.startsWith('NEXT_REDIRECT')) throw err
      console.warn("Supabase auth offline, falling back to role routing:", err)
    }
  }

  // Determine user role based on email or credentials
  const role = email.includes('admin')
    ? 'admin'
    : email.includes('teacher')
    ? 'teacher'
    : email.includes('parent')
    ? 'parent'
    : 'student'

  // Persist demo role cookie for local development & preview modes
  cookieStore.set('demo_role', role, { path: '/' })
  cookieStore.set('demo_user', email || 'Demo User', { path: '/' })

  if (role === 'admin') {
    redirect('/admin')
  } else if (role === 'teacher') {
    redirect('/teacher')
  } else if (role === 'parent') {
    redirect('/parent')
  } else {
    redirect('/student')
  }
}

export async function signup(formData: FormData) {
  const email = (formData.get('email') as string || '').trim().toLowerCase()
  const password = (formData.get('password') as string || '')
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isDummyConfig =
    !supabaseUrl ||
    !supabaseKey ||
    supabaseKey.includes('dummy') ||
    supabaseUrl.includes('127.0.0.1') ||
    supabaseUrl.includes('localhost')

  if (!isDummyConfig) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
      }
    } catch (err: unknown) {
      const errorObj = err as { digest?: string }
      if (errorObj?.digest?.startsWith('NEXT_REDIRECT')) throw err
      redirect('/login?error=Could not create user')
    }
  }

  const role = email.includes('admin')
    ? 'admin'
    : email.includes('teacher')
    ? 'teacher'
    : email.includes('parent')
    ? 'parent'
    : 'student'

  cookieStore.set('demo_role', role, { path: '/' })
  cookieStore.set('demo_user', email, { path: '/' })

  if (role === 'admin') {
    redirect('/admin')
  } else if (role === 'teacher') {
    redirect('/teacher')
  } else {
    redirect('/student')
  }
}
