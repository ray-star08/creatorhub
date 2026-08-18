import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_KEY } from "@/lib/auth-token";

/**
 * Route guard (Next.js 16 renamed `middleware` -> `proxy`).
 *
 * This is an optimistic check: it only inspects the presence of the auth
 * cookie to keep unauthenticated users out of the app shell and to bounce
 * authenticated users away from the auth pages. Real authorization is still
 * enforced by the API on every request.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/ideas",
  "/scripts",
  "/kanban",
  "/calendar",
  "/setup",
];

const AUTH_PREFIXES = ["/login", "/register"];

function matches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  if (matches(pathname, PROTECTED_PREFIXES) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (matches(pathname, AUTH_PREFIXES) && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
