import { requireRole } from "@/lib/coe-guard";
import StudentNotificationsClient from "./StudentNotificationsClient";

export default async function StudentNotificationsPage() {
  const user = await requireRole("STUDENT");

  return <StudentNotificationsClient userId={user.id} />;
}
