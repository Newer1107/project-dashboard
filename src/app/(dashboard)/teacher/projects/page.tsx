import { requireRole } from "@/lib/coe-guard";
import TeacherProjectsClient from "./TeacherProjectsClient";

export default async function TeacherProjectsPage() {
  const user = await requireRole("TEACHER");

  return <TeacherProjectsClient userId={user.id} />;
}
