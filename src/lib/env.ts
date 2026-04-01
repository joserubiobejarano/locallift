/**
 * Normalize app base URL: trim whitespace and remove trailing slashes.
 * Prevents double slashes when joining paths (e.g. OAuth `redirect_uri`).
 */
export function normalizeAppBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

function resolveServerAppBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) return normalizeAppBaseUrl(raw);
  return "http://localhost:3000";
}

/**
 * Get the application base URL.
 * Falls back to localhost:3000 for local development if NEXT_PUBLIC_APP_URL is not set.
 */
export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use the current origin
    return window.location.origin;
  }

  return resolveServerAppBaseUrl();
}

/**
 * Get the application base URL for server-side use only.
 * Use this when you need the URL in API routes or server components.
 */
export function getServerAppUrl(): string {
  return resolveServerAppBaseUrl();
}

