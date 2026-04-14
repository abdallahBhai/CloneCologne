import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Return a dummy client or null to avoid crashing the build
    // In many cases, Returning null and handling it in the component is safest
    console.warn("Supabase environment variables are missing. Database functionality will be unavailable.");
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}
