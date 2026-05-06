import { headers } from "next/headers";
import { resolveUserFromHeaders } from "@/lib/resolve-user";

export type DashboardRole = "ADMIN" | "TEACHER" | "STUDENT";

export async function getCoeUser() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("x-coe-email");
  const role = requestHeaders.get("x-coe-role");
  
  if (process.env.NODE_ENV === "development") {
    console.log("[DEBUG] getCoeUser headers:", {
      email,
      role,
      headerNames: Array.from(requestHeaders.keys()).filter(k => k.startsWith("x-coe")),
    });
  }
  
  return resolveUserFromHeaders(requestHeaders);
}

export async function requireCoeUser() {
  const user = await getCoeUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: DashboardRole | DashboardRole[]) {
  const user = await requireCoeUser();
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(user.role)) {
    if (process.env.NODE_ENV === "development") {
      console.log("[AUTH FAIL] requireRole check failed:", {
        requiredRoles: roles,
        userRole: user.role,
        userEmail: user.email,
      });
    }
    throw new Error("Unauthorized");
  }
  return user;
}
