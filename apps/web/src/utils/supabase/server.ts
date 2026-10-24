import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const DEFAULT_SUPABASE_URL = 'https://yqtkgobvfpphwrfwarls.supabase.co'
const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdGtnb2J2ZnBwaHdyZndhcmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzOTQxMzYsImV4cCI6MjEwNjk3MDEzNn0.UEdDRFOuivxAqT2vhf3SuU3LINfOyhNLWX8fx_ARK_E'

export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
