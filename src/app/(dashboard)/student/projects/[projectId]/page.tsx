import { requireRole } from "@/lib/coe-guard";
import StudentProjectDetailClient from "./StudentProjectDetailClient";

export default async function StudentProjectDetailPage() {
  const user = await requireRole("STUDENT");

  return <StudentProjectDetailClient userId={user.id} />;
}
