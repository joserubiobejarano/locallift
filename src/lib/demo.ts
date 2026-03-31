export function isDemoModeFromSearchParams(searchParams: URLSearchParams): boolean {
  return searchParams.get("demo") === "1";
}

export function isDemoModeFromCookie(): boolean {
  if (typeof window === "undefined") return false;
  return document.cookie.includes("ll_demo=true");
}

export function isDemoMode(searchParams?: URLSearchParams): boolean {
  const fromCookie = isDemoModeFromCookie();
  const fromParams = searchParams ? isDemoModeFromSearchParams(searchParams) : false;
  return fromCookie || fromParams;
}

// Demo usage limits
export const DEMO_LIMITS = {
  CONTENT: 2,
  REPLIES: 3,
  AUDITS: 1,
} as const;

// Demo usage tracking keys
export const DEMO_STORAGE_KEYS = {
  CONTENT_USED: "demoContentUsed",
  REPLIES_USED: "demoRepliesUsed",
  AUDITS_USED: "demoAuditsUsed",
} as const;

// Demo usage tracking utilities
export function getDemoUsage(key: string): number {
  if (typeof window === "undefined") return 0;
  const value = localStorage.getItem(key);
  return value ? parseInt(value, 10) : 0;
}

export function incrementDemoUsage(key: string): number {
  if (typeof window === "undefined") return 0;
  const current = getDemoUsage(key);
  const next = current + 1;
  localStorage.setItem(key, next.toString());
  return next;
}

export function checkDemoLimit(key: string, limit: number): boolean {
  return getDemoUsage(key) >= limit;
}

