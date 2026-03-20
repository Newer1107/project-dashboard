import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const VALID_ROLES = new Set(["ADMIN", "TEACHER", "STUDENT"]);

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
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role as string | undefined;
  const hasValidRole = !!role && VALID_ROLES.has(role);
  const email = (req.auth?.user as any)?.email as string | undefined;
  const isApiRoute = pathname.startsWith("/api");
  const isAuthApi = pathname.startsWith("/api/auth");
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isShowcaseAuthorRoute = pathname.startsWith("/showcase/my-projects");
  const isPublicShowcase = pathname.startsWith("/showcase") && !isShowcaseAuthorRoute;

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
