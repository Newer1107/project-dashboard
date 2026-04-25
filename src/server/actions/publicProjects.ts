"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicRBLProjects() {
  const projects = await prisma.project.findMany({
    // Optional: Only show projects that aren't in DRAFT mode
    where: { status: { not: "DRAFT" } }, 
    select: {
      id: true,
      title: true,
      department: true,
      teacher: {
        select: { name: true }
      },
      members: {
        select: {
          student: {
            select: { name: true, rollNumber: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Map the Prisma relational data to a flat, easy-to-use structure for the frontend
  return projects.map((p) => ({
    id: p.id,
    department: p.department || "General",
    title: p.title,
    guide: p.teacher?.name || "Unassigned",
    students: p.members.map((m) => ({
      name: m.student.name,
      rollNo: m.student.rollNumber || "N/A",
    }))
  }));
}