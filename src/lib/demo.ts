export function isDemoModeFromSearchParams(searchParams: URLSearchParams): boolean {
  return searchParams.get("demo") === "1";
}

