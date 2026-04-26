"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicRBLProjects() {
  const projects = await prisma.project.findMany({
    where: { 
      status: { not: "DRAFT" },
      isRblProject: true, // Only fetch projects marked as RBL
    }, 
    select: {
      id: true,
      title: true,
      department: true,
      groupNo: true,      // Fetching new field from DB
      type: true,         // Fetching from DB
      category: true,     // Fetching from DB
      application: true,  // Fetching from DB
      outcome: true,      // Fetching from DB
      poMapping: true,    // Fetching from DB
      psoMapping: true,   // Fetching from DB
      sdg: true,          // Fetching from DB
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

  // Map the Prisma relational data to a flat structure for the frontend
  return projects.map((p) => ({
    id: p.id,
    groupNo: p.groupNo || "N/A", // Pass groupNo to frontend
    department: p.department || "General",
    title: p.title,
    guide: p.teacher?.name || "Unassigned",
    students: p.members.map((m) => ({
      name: m.student.name,
      rollNo: m.student.rollNumber || "N/A",
    })),
    // Additional RBL details
    type: p.type,
    category: p.category,
    application: p.application,
    outcome: p.outcome,
    poMapping: p.poMapping,
    psoMapping: p.psoMapping,
    sdg: p.sdg,
  }));
}