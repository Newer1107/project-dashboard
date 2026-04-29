import { requireRole } from "@/lib/coe-guard";
import TeacherDashboardClient from "./TeacherDashboardClient";

export default async function TeacherDashboardPage() {
  const user = await requireRole("TEACHER");

  return <TeacherDashboardClient userId={user.id} userName={user.name} />;
}