import { verifyCoEToken } from "@/lib/coe-auth";
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isShowcaseAuthorRoute = pathname.startsWith("/showcase/my-projects");
  const isPublicShowcase = pathname.startsWith("/showcase") && !isShowcaseAuthorRoute;
  const isPublicRoute =
    isPublicShowcase ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/majorprojects") ||
    pathname.startsWith("/rblprojects-te") ||
    pathname.startsWith("/api/cron") ||
    pathname.startsWith("/api/storage");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === "development") {
    const headers = new Headers(req.headers);
    const allowedRoles = ["ADMIN", "TEACHER", "STUDENT"] as const;
    type Role = (typeof allowedRoles)[number];
    const roleParam = req.nextUrl.searchParams.get("role");
    const role: Role =
      roleParam && allowedRoles.includes(roleParam as Role)
        ? (roleParam as Role)
        : "ADMIN";

    const emailMap: Record<Role, string | undefined> = {
      ADMIN: process.env.DEV_AUTH_ADMIN_EMAIL,
      TEACHER: process.env.DEV_AUTH_TEACHER_EMAIL,
      STUDENT: process.env.DEV_AUTH_STUDENT_EMAIL,
    };

    const email = emailMap[role];
    if (!email) {
      throw new Error(`DEV_AUTH: Missing email for role ${role}`);
    }

    headers.set("x-coe-email", email);
    headers.set("x-coe-name", "Dev User");
    headers.set("x-coe-role", role);
    headers.set("x-coe-status", "ACTIVE");

    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  const token = req.cookies.get("coe_shared_token")?.value;
  if (!token) {
    const loginUrl = new URL("http://localhost:3000//login");
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
  requestHeaders.set("x-coe-name", payload.name || "");
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
