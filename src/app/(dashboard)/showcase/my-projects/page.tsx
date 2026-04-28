import { requireRole } from "@/lib/coe-guard";
import MyShowcaseProjectsClient from "./MyShowcaseProjectsClient";

export default async function MyShowcaseProjectsPage() {
  const user = await requireRole(["ADMIN", "TEACHER", "STUDENT"]);

  return <MyShowcaseProjectsClient role={user.role} />;
}
