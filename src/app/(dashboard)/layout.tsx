import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
    image?: string | null;
  };

  // Redirect to role-based home
  return (
    <DashboardShell
      userId={user.id}
      userName={user.name ?? "User"}
      userRole={user.role}
      userImage={user.image}
    >
      {children}
    </DashboardShell>
  );
}
