import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // only protect dashboard routes — login/register handle their own redirects
  // via server-side auth() checks in the page components
  if (!protectedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const cookies = req.cookies;
  const isLoggedIn =
    cookies.has("authjs.session-token") ||
    cookies.has("__Secure-authjs.session-token") ||
    cookies.has("next-auth.session-token") ||
    cookies.has("__Secure-next-auth.session-token");

  if (!isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
