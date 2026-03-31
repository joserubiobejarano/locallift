/**
 * Prevent open redirects after login: only allow same-origin relative paths.
 */
export function safeRelativeRedirect(
  url: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (!url || typeof url !== "string") return fallback;
  if (!url.startsWith("/")) return fallback;
  if (url.startsWith("//")) return fallback;
  return url;
}
