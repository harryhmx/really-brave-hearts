import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const sessionToken =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");
  const isLoggedIn = !!sessionToken?.value;

  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isLoggedIn && isPublicRoute && nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
