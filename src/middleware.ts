import { verifyCoEToken } from "@/lib/coe-auth";
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isShowcaseAuthorRoute = pathname.startsWith("/showcase/my-projects");
  const isPublicShowcase = pathname.startsWith("/showcase") && !isShowcaseAuthorRoute;
  const isPublicRoute =
    isPublicShowcase ||
    pathname.startsWith("/majorprojects") ||
    pathname.startsWith("/rblprojects-te") ||
    pathname.startsWith("/api/cron") ||
    pathname.startsWith("/api/storage");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get("coe_shared_token")?.value;
  if (!token) {
    const loginUrl = new URL("https://tcetcercd.in/login");
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyCoEToken(token);
  if (!payload || payload.status !== "ACTIVE") {
    const loginUrl = new URL("https://tcetcercd.in/login");
    loginUrl.searchParams.set("reason", "session_expired");
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-coe-email", payload.email);
  requestHeaders.set("x-coe-role", payload.role);
  requestHeaders.set("x-coe-status", payload.status);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher:"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)",
};