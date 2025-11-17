import { supabaseBrowser } from "@/lib/supabase/client";

export async function ensureBrowserToken() {
  const { data, error } = await supabaseBrowser().auth.getSession();
  if (error || !data?.session?.access_token) return null;
  return data.session.access_token;
}

