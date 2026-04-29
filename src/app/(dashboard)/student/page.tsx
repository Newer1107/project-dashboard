import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolveUser } from "@/lib/resolve-user";
import StudentDashboardClient from "./StudentDashboardClient";

export default async function StudentDashboardPage() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("x-coe-email");
  const role = requestHeaders.get("x-coe-role");
  const status = requestHeaders.get("x-coe-status");

  if (!email || !role || !status) {
    redirect("https://tcetcercd.in/login?reason=session_expired");
  }

  const user = await resolveUser({ email, role, status });
  if (!user) {
    redirect("https://tcetcercd.in/login?reason=session_expired");
  }

  return <StudentDashboardClient userId={user.id} userName={user.name} />;
}
