import { createClient } from '@supabase/supabase-js';

/**
 * Creates a privileged Supabase client utilizing the SUPABASE_SERVICE_ROLE_KEY.
 * WARNING: This client bypasses PostgreSQL Row Level Security (RLS).
 * MUST only be invoked from secure server-side environments (Server Actions, API Route Handlers).
 * NEVER expose this client or its secret key to client-side components.
 */
const DEFAULT_SUPABASE_URL = 'https://yqtkgobvfpphwrfwarls.supabase.co';
const DEFAULT_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdGtnb2J2ZnBwaHdyZndhcmxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTM5NDEzNiwiZXhwIjoyMTA2OTcwMTM2fQ.MwxHQBB-wRc3ktnHs36MFuPa1ePIBfagK3ad8_FQhhM';

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY;

  return createClient(
    url,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
