import { headers } from "next/headers";
import { resolveUserFromHeaders } from "@/lib/resolve-user";

export type DashboardRole = "ADMIN" | "TEACHER" | "STUDENT";

export async function getCoeUser() {
  const requestHeaders = await headers();
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
    throw new Error("Unauthorized");
  }
  return user;
}