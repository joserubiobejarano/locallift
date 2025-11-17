import { createClient } from "@supabase/supabase-js";

export function supabaseAsUser(accessToken: string) {
  // Use the anon key, but attach the user's JWT so RLS sees auth.uid()
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}


