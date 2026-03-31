import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getAppBaseUrl } from "@/lib/app-base-url";
import { userHasGbpConnection } from "@/lib/db/gbp";

function isProtectedAppPage(pathname: string): boolean {
  const prefixes = [
    "/dashboard",
    "/reviews",
    "/content",
    "/audit",
    "/settings",
    "/connect",
  ];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Logged-in app areas that require GBP before access (not /connect). */
function needsGbpBeforeAccess(pathname: string): boolean {
  const prefixes = ["/dashboard", "/reviews", "/content", "/audit", "/settings"];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default auth(async (req) => {
  const { pathname, searchParams } = req.nextUrl;
  const sessionUser = req.auth?.user;

  const demoCookie = req.cookies.get("ll_demo")?.value === "true";
  const demoParam = searchParams.get("demo") === "1";
  const isDemoMode = !sessionUser && (demoCookie || demoParam);

  const requestHeaders = new Headers(req.headers);
  if (isDemoMode) {
    requestHeaders.set("x-demo", "true");
  }

  if (isDemoMode) {
    if (pathname.startsWith("/api/google/oauth")) {
      return NextResponse.json(
        { error: "Google connection not available in demo mode" },
        { status: 403 }
      );
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  const needsSession =
    !pathname.startsWith("/api") &&
    !isAuthPage &&
    isProtectedAppPage(pathname);

  if (needsSession && !sessionUser) {
    const callbackPath = pathname + (req.nextUrl.search || "");
    const loginSearch = new URLSearchParams({ callbackUrl: callbackPath });
    const login = new URL(`/login?${loginSearch.toString()}`, getAppBaseUrl(req));
    return NextResponse.redirect(login);
  }

  const userId = sessionUser?.id;
  if (userId && !pathname.startsWith("/api")) {
    try {
      const hasGbp = await userHasGbpConnection(userId);

      if (
        (pathname === "/connect" || pathname.startsWith("/connect/")) &&
        hasGbp
      ) {
        return NextResponse.redirect(
          new URL("/dashboard", getAppBaseUrl(req)),
          302
        );
      }

      if (needsGbpBeforeAccess(pathname) && !hasGbp) {
        return NextResponse.redirect(new URL("/connect", getAppBaseUrl(req)), 302);
      }
    } catch (e) {
      console.error("[middleware] GBP connection check failed", e);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
