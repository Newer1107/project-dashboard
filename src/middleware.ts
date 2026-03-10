import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  // Public paths
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    if (isLoggedIn) {
      const redirectPath =
        role === "ADMIN" ? "/admin" : role === "TEACHER" ? "/teacher" : "/student";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
    return NextResponse.next();
  }

  // Auth required
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname.startsWith("/teacher") && role !== "TEACHER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname.startsWith("/student") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
