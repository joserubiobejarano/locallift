import { getUserFromRequest } from "@/lib/auth-server";
import { supabaseServer } from "@/lib/supabase/server";

export async function resolveUser(req: Request) {
  const tokenUser = await getUserFromRequest(req);
  if (tokenUser) return tokenUser;

  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user) return session.user;

  return null;
}

