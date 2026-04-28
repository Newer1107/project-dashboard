import { auth } from "@/lib/auth";
import { verifyCoEToken } from "@/lib/coe-auth";
import { NextResponse } from "next/server";

const VALID_ROLES = new Set(["ADMIN", "TEACHER", "STUDENT"]);
const COE_AUTH_ROUTES = ["/student"];

function buildLoginRedirect(req: any, callbackPath?: string) {
  const loginUrl = new URL("/login", req.url);
  if (callbackPath) {
    loginUrl.searchParams.set("callbackUrl", callbackPath);
  }

  const response = NextResponse.redirect(loginUrl);

  // Clear both possible Auth.js cookie names to recover from stale/invalid sessions.
  response.cookies.set("authjs.session-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("__Secure-authjs.session-token", "", { maxAge: 0, path: "/" });

  return response;
}

async function emailAllowedFromMiddleware(req: Request, email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  if (normalizedEmail.endsWith("@tcetmumbai.in")) {
    return true;
  }

  const url = new URL("/api/auth/allowed-email", req.url);
  url.searchParams.set("email", normalizedEmail);

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) {
      return false;
    }
    const data = (await response.json()) as { allowed?: boolean };
    return data.allowed === true;
  } catch {
    return false;
  }
}

function roleHome(role: string | undefined): string {
  if (role === "ADMIN") return "/admin";
  if (role === "TEACHER") return "/teacher";
  return "/student";
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isCoeAuthRoute = COE_AUTH_ROUTES.includes(pathname);

  if (isCoeAuthRoute) {
    const token = req.cookies.get("coe_shared_token")?.value;
    if (!token) {
      const loginUrl = new URL("https://tcetcercd.in/login");
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(loginUrl);
    }

    const payload = verifyCoEToken(token);
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
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role as string | undefined;
  const hasValidRole = !!role && VALID_ROLES.has(role);
  const email = (req.auth?.user as any)?.email as string | undefined;
  
  const isApiRoute = pathname.startsWith("/api");
  const isAuthApi = pathname.startsWith("/api/auth");
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");
  const isShowcaseAuthorRoute = pathname.startsWith("/showcase/my-projects");
  const isPublicShowcase = pathname.startsWith("/showcase") && !isShowcaseAuthorRoute;
  
  // Custom public routes
  const isPublicRblTable = pathname.startsWith("/rblprojects-te");
  const isPublicMajorProjects = pathname.startsWith("/majorprojects"); // Added this line
  const isPublicAnalytics = pathname.startsWith("/analytics");

  // NextAuth API routes are always public
  if (isAuthApi) {
    return NextResponse.next();
  }

  // Public auth pages
  if (isAuthPage) {
    if (isLoggedIn) {
      if (!hasValidRole) {
        return buildLoginRedirect(req);
      }
      return NextResponse.redirect(new URL(roleHome(role), req.url));
    }
    return NextResponse.next();
  }

  // Public showcase listing is visible without auth
  if (isPublicShowcase) {
    return NextResponse.next();
  }

  // Allow /rblprojects-te
  if (isPublicRblTable) {
    return NextResponse.next();
  }

  // Allow /majorprojects
  if (isPublicMajorProjects) { // Added this block
    return NextResponse.next();
  }

  // Allow /analytics
  if (isPublicAnalytics) {
    return NextResponse.next();
  }

  // Auth required
  if (!isLoggedIn) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return buildLoginRedirect(req, pathname);
  }

  if (!hasValidRole) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }
    return buildLoginRedirect(req, pathname);
  }

  if (role !== "ADMIN" && email && !(await emailAllowedFromMiddleware(req, email))) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Unauthorized email domain" },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access — redirect to own dashboard instead of login
  const rolePrefixMap: Record<string, string> = {
    ADMIN: "/admin",
    TEACHER: "/teacher",
    STUDENT: "/student",
  };

  for (const [requiredRole, prefix] of Object.entries(rolePrefixMap)) {
    if (pathname.startsWith(prefix) && role !== requiredRole) {
      if (isApiRoute) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }
      const target = roleHome(role);
      if (target === pathname) {
        return buildLoginRedirect(req, pathname);
      }
      return NextResponse.redirect(new URL(target, req.url));
    }
  }

  if (isShowcaseAuthorRoute && role !== "STUDENT" && role !== "TEACHER") {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }
    const target = roleHome(role);
    if (target === pathname) {
      return buildLoginRedirect(req, pathname);
    }
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher:"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)",
};