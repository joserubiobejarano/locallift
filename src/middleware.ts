import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export function middleware(_req: NextRequest) {
  // Temporary: allow everything. We’ll re-enable auth guards later.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
