import { requireRole } from "@/lib/coe-guard";
import TeacherAnalyticsClient from "./TeacherAnalyticsClient";

export default async function TeacherAnalyticsPage() {
  const user = await requireRole("TEACHER");

  return <TeacherAnalyticsClient userId={user.id} />;
}
