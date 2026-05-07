import { prisma } from "@/lib/prisma";
import { mapCoERoleToDashboard } from "@/lib/coe-auth";

export type CoeAuthUser = {
  email: string;
  name?: string;
  role: string;
  status: string;
};

type ResolvedUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  isActive: boolean;
  avatarUrl: string | null;
};

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function defaultName(email: string) {
  const localPart = email.split("@")[0];
  return localPart?.trim() || email;
}

export async function resolveUser(authUser: CoeAuthUser): Promise<ResolvedUser | null> {
  if (authUser.status !== "ACTIVE") return null;

  const mappedRole = mapCoERoleToDashboard(authUser.role);
  if (!mappedRole) return null;

  const email = normalizeEmail(authUser.email);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, isActive: true, avatarUrl: true },
    });

    if (existing) {
      // Sync name if provided and changed
      if (authUser.name && existing.name !== authUser.name) {
        await tx.user.update({
          where: { id: existing.id },
          data: { name: authUser.name },
        });
      }
      return {
        id: existing.id,
        name: authUser.name || existing.name,
        email: existing.email,
        role: existing.role,
        isActive: existing.isActive,
        avatarUrl: existing.avatarUrl,
      };
    }

    const created = await tx.user.create({
      data: {
        name: authUser.name || defaultName(email),
        email,
        role: mappedRole,
        isActive: true,
        passwordHash: "",
      },
      select: { id: true, name: true, email: true, role: true, isActive: true, avatarUrl: true },
    });

    const pendingAssignments = await tx.pendingProjectAssignment.findMany({
      where: {
        email,
        status: "PENDING",
      },
      select: {
        projectId: true,
        memberRole: true,
      },
    });

    if (pendingAssignments.length > 0) {
      await tx.projectMember.createMany({
        data: pendingAssignments.map((assignment) => ({
          projectId: assignment.projectId,
          studentId: created.id,
          role: assignment.memberRole,
        })),
        skipDuplicates: true,
      });

      await tx.pendingProjectAssignment.updateMany({
        where: {
          email,
          status: "PENDING",
        },
        data: {
          status: "ASSIGNED",
        },
      });
    }

    return created;
  });
}

export function getCoeAuthFromHeaders(requestHeaders: Headers): CoeAuthUser | null {
  const email = requestHeaders.get("x-coe-email");
  const name = requestHeaders.get("x-coe-name") || undefined;
  const role = requestHeaders.get("x-coe-role");
  const status = requestHeaders.get("x-coe-status");

  if (!email || !role || !status) return null;

  return { email, name, role, status };
}

export async function resolveUserFromHeaders(
  requestHeaders: Headers
): Promise<ResolvedUser | null> {
  const authUser = getCoeAuthFromHeaders(requestHeaders);
  if (!authUser) return null;
  return resolveUser(authUser);
}