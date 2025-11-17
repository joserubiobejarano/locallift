import { supabaseAdmin } from "@/lib/supabase/admin";
import { getServerAppUrl } from "@/lib/env";

const GOOGLE_AUTH_BASE = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GBP_API_BASE = "https://businessprofile.googleapis.com/v1";

export function googleAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${getServerAppUrl()}/api/google/oauth/callback`,
    response_type: "code",
    access_type: "offline",
    include_granted_scopes: "true",
    scope: "https://www.googleapis.com/auth/business.manage",
    state,
    prompt: "consent",
  });
  return `${GOOGLE_AUTH_BASE}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const body = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: `${getServerAppUrl()}/api/google/oauth/callback`,
    grant_type: "authorization_code",
  });

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);

  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope?: string;
    token_type: string;
  }>;
}

export async function refreshAccessToken(refresh_token: string) {
  const body = new URLSearchParams({
    refresh_token,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) throw new Error(`Refresh token failed: ${res.status}`);

  return res.json() as Promise<{ access_token: string; expires_in: number; token_type: string; scope?: string }>;
}

export async function gbpFetch(path: string, accessToken: string) {
  const res = await fetch(`${GBP_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GBP fetch ${path} failed: ${res.status} ${text}`);
  }

  return res.json();
}

// Token management helpers
type Tokens = {
  access_token: string;
  refresh_token: string;
  expires_at: string; // ISO
  scope?: string | null;
};

export async function getUserGoogleTokens(userId: string): Promise<Tokens | null> {
  const admin = supabaseAdmin();

  const { data, error } = await admin
    .from("gbp_connections")
    .select("access_token, refresh_token, expires_at, scope")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return data as Tokens;
}

function isExpired(expires_at: string, skewSec = 120): boolean {
  return Date.now() + skewSec * 1000 >= new Date(expires_at).getTime();
}

export async function refreshIfNeeded(userId: string, tokens: Tokens): Promise<Tokens> {
  if (!isExpired(tokens.expires_at)) return tokens;

  const params = new URLSearchParams();
  params.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  params.set("client_secret", process.env.GOOGLE_CLIENT_SECRET!);
  params.set("grant_type", "refresh_token");
  params.set("refresh_token", tokens.refresh_token);

  const r = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!r.ok) throw new Error(`Google refresh failed: ${await r.text()}`);

  const json = await r.json();

  const newTokens: Tokens = {
    access_token: json.access_token,
    refresh_token: tokens.refresh_token, // usually unchanged
    expires_at: new Date(Date.now() + json.expires_in * 1000).toISOString(),
    scope: json.scope ?? tokens.scope ?? null,
  };

  // Save back using the secured RPC
  const admin = supabaseAdmin();
  const { error } = await admin.rpc("update_gbp_tokens", {
    p_user_id: userId,
    p_access_token: newTokens.access_token,
    p_refresh_token: newTokens.refresh_token,
    p_expires_at: newTokens.expires_at,
    p_scope: newTokens.scope,
  });

  if (error) throw error;

  return newTokens;
}

export async function googleFetch(
  userId: string,
  url: string,
  opts?: RequestInit
): Promise<Response> {
  let tokens = await getUserGoogleTokens(userId);
  if (!tokens) throw new Error("No Google connection found.");

  tokens = await refreshIfNeeded(userId, tokens);

  const headers = new Headers(opts?.headers);
  headers.set("Authorization", `Bearer ${tokens.access_token}`);

  return fetch(url, { ...opts, headers });
}

