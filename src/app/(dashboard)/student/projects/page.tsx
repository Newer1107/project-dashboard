import { requireRole } from "@/lib/coe-guard";
import StudentProjectsClient from "./StudentProjectsClient";

export default async function StudentProjectsPage() {
  const user = await requireRole("STUDENT");

  return <StudentProjectsClient userId={user.id} />;
}
