/**
 * Get the application base URL.
 * Falls back to localhost:3000 for local development if NEXT_PUBLIC_APP_URL is not set.
 */
export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use the current origin
    return window.location.origin;
  }
  
  // Server-side: use env var or fallback to localhost
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * Get the application base URL for server-side use only.
 * Use this when you need the URL in API routes or server components.
 */
export function getServerAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

