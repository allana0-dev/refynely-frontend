import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/presentations", "/templates"];
const publicOnlyPaths = ["/login", "/signup", "/"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  if (protectedPaths.some((path) => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (publicOnlyPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/presentations/me", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/presentations/:path*",
    "/templates/:path*",
  ],
};
