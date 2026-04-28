import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolveUserFromHeaders } from "@/lib/resolve-user";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const user = await resolveUserFromHeaders(requestHeaders);

  if (!user || user.role !== "TEACHER") {
    redirect("/");
  }

  return children;
}
