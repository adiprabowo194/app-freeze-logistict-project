import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";

  // ❌ belum login → redirect ke login
  if (!session && !isHome && !isLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ sudah login → kalau akses "/" atau "/login" → ke dashboard
  if (session && (isHome || isLogin)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/quote/:path*",
    "/api/:path*",
    "/jobs/:path*",
  ],
};
