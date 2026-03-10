import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  if (role === "ADMIN") redirect("/admin");
  if (role === "TEACHER") redirect("/teacher");
  redirect("/student");
}
