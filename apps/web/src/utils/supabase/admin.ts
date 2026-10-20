import { createClient } from '@supabase/supabase-js';

/**
 * Creates a privileged Supabase client utilizing the SUPABASE_SERVICE_ROLE_KEY.
 * WARNING: This client bypasses PostgreSQL Row Level Security (RLS).
 * MUST only be invoked from secure server-side environments (Server Actions, API Route Handlers).
 * NEVER expose this client or its secret key to client-side components.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yqtkgobvfpphwrfwarls.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.warn(
      '[Supabase Admin] Warning: SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables. Falling back to anon key.'
    );
  }

  return createClient(
    url,
    serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
