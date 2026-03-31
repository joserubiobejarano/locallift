import { sql } from "@/lib/db/neon";

export type ProfileReplyRow = {
  business_name: string | null;
  reply_tone: string | null;
  owner_name: string | null;
  contact_preference: string | null;
};

/** Load saved review-reply defaults from profiles. Returns null if row missing or query fails. */
export async function getProfileReplyDefaults(
  userId: string
): Promise<ProfileReplyRow | null> {
  const rows = await sql`
    SELECT business_name, reply_tone, owner_name, contact_preference
    FROM public.profiles
    WHERE id = ${userId}
    LIMIT 1
  `;

  const data = rows[0] as ProfileReplyRow | undefined;
  if (!data) return null;
  return data;
}
