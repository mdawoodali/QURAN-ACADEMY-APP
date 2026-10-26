'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { sanitizeRedirectPath } from '@/lib/security/redirect'

export async function getSafeRedirectPath(redirectUrl?: string | null): Promise<string | null> {
  return sanitizeRedirectPath(redirectUrl)
}

export async function login(formData: FormData) {
  const email = (formData.get('email') as string || '').trim().toLowerCase()
  const password = (formData.get('password') as string || '')
  const redirectParam = (formData.get('redirect') as string || '').trim()
  const safeRedirect = await getSafeRedirectPath(redirectParam)
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
      const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
      }

      if (authData?.user) {
        let profileRole: string | undefined = (authData.user.user_metadata?.role as string) || undefined
        let profileName: string | undefined = (authData.user.user_metadata?.full_name as string) || undefined

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, first_name, last_name')
            .eq('id', authData.user.id)
            .single()

          if (profile?.role) profileRole = profile.role
          const combined = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
          if (combined) profileName = combined
        } catch {}

        const userRole = profileRole || 'student'
        const userName = profileName || email
        cookieStore.set('demo_role', userRole, { path: '/' })
        cookieStore.set('demo_user', userName, { path: '/' })

        try {
          revalidatePath('/', 'layout')
        } catch {}

        if (safeRedirect) {
          redirect(safeRedirect)
        }

        if (userRole === 'admin' || userRole === 'superadmin') redirect('/admin')
        if (userRole === 'teacher') redirect('/teacher')
        if (userRole === 'parent') redirect('/parent')
        redirect('/student')
      }
    } catch (err: unknown) {
      const errorObj = err as { digest?: string; message?: string }
      if (errorObj?.digest?.startsWith('NEXT_REDIRECT')) throw err
      console.warn("Supabase auth offline, falling back to role routing:", err)
    }
  }

  // Determine user role based on database profile or email pattern
  let role = (email.includes('superadmin') || email.includes('admin'))
    ? 'admin'
    : email.includes('teacher')
    ? 'teacher'
    : email.includes('parent')
    ? 'parent'
    : 'student'
  let userName = email.split('@')[0] || 'User'

  try {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, first_name, last_name')
      .eq('email', email)
      .maybeSingle()

    if (profile?.role) {
      role = profile.role
      const combined = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
      if (combined) userName = combined
    }
  } catch {}

  // Persist demo role cookie for local development & preview modes
  cookieStore.set('demo_role', role, { path: '/' })
  cookieStore.set('demo_user', userName, { path: '/' })

  try {
    revalidatePath('/', 'layout')
  } catch {}

  if (safeRedirect) {
    redirect(safeRedirect)
  }

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
  const redirectParam = (formData.get('redirect') as string || '').trim()
  const safeRedirect = await getSafeRedirectPath(redirectParam)
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
      const { data: authData, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
      }

      if (authData?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, first_name, last_name')
          .eq('id', authData.user.id)
          .single()

        const userRole = profile?.role || 'student'
        const userName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || email
        cookieStore.set('demo_role', userRole, { path: '/' })
        cookieStore.set('demo_user', userName, { path: '/' })

        try {
          revalidatePath('/', 'layout')
        } catch {}

        if (safeRedirect) {
          redirect(safeRedirect)
        }

        if (userRole === 'admin' || userRole === 'superadmin') redirect('/admin')
        if (userRole === 'teacher') redirect('/teacher')
        if (userRole === 'parent') redirect('/parent')
        redirect('/student')
      }
    } catch (err: unknown) {
      const errorObj = err as { digest?: string }
      if (errorObj?.digest?.startsWith('NEXT_REDIRECT')) throw err
      redirect('/login?error=Could not create user')
    }
  }

  const role = (email.includes('superadmin') || email.includes('admin'))
    ? 'admin'
    : email.includes('teacher')
    ? 'teacher'
    : email.includes('parent')
    ? 'parent'
    : 'student'

  cookieStore.set('demo_role', role, { path: '/' })
  cookieStore.set('demo_user', email, { path: '/' })

  try {
    revalidatePath('/', 'layout')
  } catch {}

  if (safeRedirect) {
    redirect(safeRedirect)
  }

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

export async function loginWithGoogle(formData?: FormData) {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const redirectParam = (formData?.get('redirect') as string || '').trim()
  const safeRedirect = await getSafeRedirectPath(redirectParam)

  const requestedRole = (formData?.get('role') as string || '').trim().toLowerCase()
  if (['student', 'parent', 'teacher'].includes(requestedRole)) {
    cookieStore.set('pending_oauth_role', requestedRole, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 600,
    })
  }

  const wardsData = (formData?.get('wardsData') as string || '').trim()
  if (wardsData) {
    cookieStore.set('pending_oauth_wards', wardsData, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 600,
    })
  }

  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') || headerList.get('host')
  const proto = headerList.get('x-forwarded-proto') || (host && host.includes('localhost') ? 'http' : 'https')
  const rawOrigin = host
    ? `${proto}://${host}`
    : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  const origin = rawOrigin.replace(/\/+$/, '')

  let callbackUrl = `${origin}/auth/callback`
  if (safeRedirect) {
    cookieStore.set('auth_redirect', safeRedirect, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 300,
    })
    callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(safeRedirect)}`
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  if (data?.url) {
    redirect(data.url)
  }
}
