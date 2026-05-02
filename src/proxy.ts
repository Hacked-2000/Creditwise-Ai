import { NextRequest, NextResponse } from "next/server";

// runs in the Edge runtime — no Prisma, no Node.js APIs here
// cookie check is enough to decide if someone should be redirected

const protectedPaths = ["/dashboard"];
const guestOnlyPaths = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // NextAuth v5 sets this cookie for JWT sessions
  const sessionCookie =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token"); // https uses the __Secure- prefix

  const isLoggedIn = !!sessionCookie;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isGuestOnly = guestOnlyPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestOnly && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
