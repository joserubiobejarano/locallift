import { auth } from "@/auth";

export type ResolvedUser =
  | { id: string; email?: string | null; demo?: false }
  | { demo: true; id: string };

/**
 * Resolve the current user for API routes: demo cookie short-circuit, then Auth.js session.
 */
export async function resolveUser(req: Request): Promise<ResolvedUser | null> {
  const cookieHeader = req.headers.get("cookie") || "";
  if (cookieHeader.includes("ll_demo=true")) {
    return { demo: true, id: "demo-user" };
  }

  const session = await auth();
  if (session?.user?.id) {
    return {
      id: session.user.id,
      email: session.user.email,
      demo: false,
    };
  }

  return null;
}
