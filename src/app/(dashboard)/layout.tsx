import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { resolveUser } from "@/lib/resolve-user";
import { DashboardShell } from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = headers();
  const coeEmail = requestHeaders.get("x-coe-email");
  const coeRole = requestHeaders.get("x-coe-role");
  const coeStatus = requestHeaders.get("x-coe-status");

  let user:
    | {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "TEACHER" | "STUDENT";
        image?: string | null;
      }
    | null = null;

  if (coeEmail && coeRole && coeStatus) {
    user = await resolveUser({
      email: coeEmail,
      role: coeRole,
      status: coeStatus,
    });

    if (!user) {
      redirect("https://tcetcercd.in/login?reason=session_expired");
    }
  } else {
    const session = await auth();
    if (!session?.user) redirect("/login");

    user = session.user as {
      id: string;
      name: string;
      email: string;
      role: "ADMIN" | "TEACHER" | "STUDENT";
      image?: string | null;
    };
  }

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
