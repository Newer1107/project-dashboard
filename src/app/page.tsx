import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolveUserFromHeaders } from "@/lib/resolve-user";

export default async function HomePage() {
  const requestHeaders = await headers();
  const user = await resolveUserFromHeaders(requestHeaders);

  if (!user) {
    redirect("https://tcetcercd.in/login?callbackUrl=https://showcase.tcetcercd.in/");
  }

  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "TEACHER") redirect("/teacher");
  redirect("/student");
}
