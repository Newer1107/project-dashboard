"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ThemeToggle from "@/components/ui/ThemeToggle";
import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";
import { getPublicRBLProjects } from "@/server/actions/publicProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"; // Added Badge import

type RBLStudent = {
  name: string;
  rollNo: string;
};

// 1. Updated Interface with new fields
type RBLProject = {
  id: string;
  department: string;
  title: string;
  guide: string;
  students: RBLStudent[];
  type?: string;
  category?: string;
  application?: string;
  outcome?: string;
  poMapping?: string;
  psoMapping?: string;
  sdg?: string;
};

// Helper function to format Enums (e.g., "SOCIETY_USE" -> "Society Use")
const formatEnum = (str?: string) => {
  if (!str) return "—";
  return str
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

// Helper to clean up SDG strings
const formatSDG = (sdg?: string) => {
  if (!sdg) return "—";
  return sdg.replace("GOAL_", "").replace(/_/g, " ");
};

export default function ProjectTable() {
  const [scrollY, setScrollY] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState<
    string | null
  >(null);

  // Fetch live data from Prisma
  const { data, isLoading } = useQuery({
    queryKey: ["public-rbl-projects"],
    queryFn: async () => {
      const res = await getPublicRBLProjects();
      return res as RBLProject[];
    },
  });

  // Provide the default array here so TypeScript strict-typing catches it perfectly
  const rblProjects: RBLProject[] = data || [];

  React.useEffect(() => {
    let animationFrameId: number | null = null;

    const handleScroll = () => {
      if (animationFrameId !== null) return;
      animationFrameId = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        animationFrameId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (animationFrameId !== null)
        window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Extract unique departments for the dropdown filter dynamically
  const uniqueDepartments = React.useMemo(() => {
    const depts = new Set(rblProjects.map((p) => p.department));
    return Array.from(depts).sort();
  }, [rblProjects]);

  // Filter logic
  const filteredProjects = React.useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return rblProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchLower) ||
        project.guide.toLowerCase().includes(searchLower) ||
        project.students.some((s) =>
          s.name.toLowerCase().includes(searchLower),
        );

      const matchesFilter =
        !selectedDepartment || project.department === selectedDepartment;

      return matchesSearch && matchesFilter;
    });
  }, [rblProjects, searchTerm, selectedDepartment]);

  return (
    <div className="relative w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 h-24 pointer-events-none">
        <div className="relative w-full max-w-7xl mx-auto h-full px-6">
          <div className="pointer-events-auto">
            <FloatingPillNavbar />
          </div>
        </div>
      </div>

      <ThemeToggle />

      <div className="relative w-full max-w-[1600px] mx-auto px-6 pb-12 pt-32 space-y-12 text-neutral-800 dark:text-neutral-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
              RBL Projects <br />
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl text-lg leading-relaxed">
              Explore TE RBL projects from TCET with student allocation details,
              project titles, classifications, and assigned guides.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4 max-w-4xl"
        >
          <div className="relative flex-1 group">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300 -z-10"></div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl focus-within:border-emerald-500 transition-colors">
              <svg
                className="w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search projects, guides, or students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-neutral-900 dark:text-white placeholder-neutral-500"
              />
            </div>
          </div>

          <div className="w-full md:w-64">
            <Select
              value={selectedDepartment || "ALL"}
              onValueChange={(value) =>
                setSelectedDepartment(value === "ALL" ? null : value)
              }
            >
              <SelectTrigger className="w-full h-12 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-white font-medium outline-none focus:ring-1 focus:ring-emerald-500 transition-colors">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xl">
                <SelectItem value="ALL" className="font-medium">
                  All Departments
                </SelectItem>
                {uniqueDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept} className="font-medium">
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
          Showing{" "}
          <span className="font-bold">
            {isLoading ? "..." : filteredProjects.length}
          </span>{" "}
          of{" "}
          <span className="font-bold">
            {isLoading ? "..." : rblProjects.length}
          </span>{" "}
          projects
        </p>

        <motion.div
          style={{
            scale: Math.min(1, 0.95 + scrollY / 3000),
            opacity: Math.max(0.5, 1 - scrollY / 1500),
          }}
          className="origin-top"
        >
          <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
            {/* 2. Increased max-width to allow scrolling for the new columns */}
            <div className="w-full overflow-x-auto max-h-[70vh] custom-scrollbar">
              <table
                className="w-full text-left text-sm whitespace-nowrap"
                style={{ minWidth: "1400px" }}
              >
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 sticky top-0 z-20 shadow-sm">
                  <tr>
                    <th className="px-4 py-4 font-semibold w-72">
                      Project & Domain
                    </th>
                    <th className="px-4 py-4 font-semibold w-32">Type</th>
                    <th className="px-4 py-4 font-semibold w-40">Category</th>
                    <th className="px-4 py-4 font-semibold w-40">
                      Application
                    </th>
                    <th className="px-4 py-4 font-semibold w-32">Outcome</th>
                    <th className="px-4 py-4 font-semibold w-48">
                      PO/PSO Mapping
                    </th>
                    <th className="px-4 py-4 font-semibold w-64">Students</th>
                    <th className="px-4 py-4 font-semibold w-40">Guide</th>
                    <th className="px-4 py-4 font-semibold w-48">SDG</th>
                  </tr>
                </thead>

                <AnimatePresence>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 9 }).map((_, colIdx) => (
                            <td key={colIdx} className="px-4 py-4">
                              <Skeleton className="h-6 w-full max-w-[120px]" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filteredProjects.length > 0 ? (
                      filteredProjects.map((project, idx) => (
                        <motion.tr
                          key={project.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                          className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group/row"
                        >
                          {/* Project & Domain */}
                          <td className="px-4 py-4 align-top max-w-[300px] whitespace-normal">
                            <p className="font-bold text-neutral-900 dark:text-neutral-100 leading-snug mb-2">
                              {project.title}
                            </p>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium text-[10px] tracking-wider uppercase">
                              {project.department}
                            </span>
                          </td>

                          {/* Type Badge */}
                          <td className="px-4 py-4 align-top">
                            {project.type ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800"
                              >
                                {project.type}
                              </Badge>
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )}
                          </td>

                          {/* Category */}
                          <td className="px-4 py-4 align-top font-medium text-neutral-700 dark:text-neutral-300">
                            {formatEnum(project.category)}
                          </td>

                          {/* Application Focus */}
                          <td className="px-4 py-4 align-top text-neutral-600 dark:text-neutral-400">
                            {formatEnum(project.application)}
                          </td>

                          {/* Outcome */}
                          <td className="px-4 py-4 align-top text-neutral-600 dark:text-neutral-400">
                            {formatEnum(project.outcome)}
                          </td>

                          {/* PO/PSO Mapping */}
                          <td className="px-4 py-4 align-top">
                            <div className="flex flex-col gap-1 text-xs">
                              <div className="text-neutral-600 dark:text-neutral-400">
                                <span className="font-bold text-neutral-900 dark:text-neutral-200">
                                  PO:
                                </span>{" "}
                                {project.poMapping || "—"}
                              </div>
                              <div className="text-neutral-600 dark:text-neutral-400">
                                <span className="font-bold text-neutral-900 dark:text-neutral-200">
                                  PSO:
                                </span>{" "}
                                {project.psoMapping || "—"}
                              </div>
                            </div>
                          </td>

                          {/* Students List */}
                          <td className="px-4 py-4 align-top">
                            <ul className="space-y-1">
                              {project.students.map((student) => (
                                <li
                                  key={`${project.id}-${student.rollNo}`}
                                  className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2"
                                >
                                  <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 w-16 shrink-0">
                                    {student.rollNo}
                                  </span>
                                  <span className="font-medium text-sm group-hover/row:text-neutral-900 dark:group-hover/row:text-neutral-200 transition-colors truncate max-w-[150px]">
                                    {student.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </td>

                          {/* Guide */}
                          <td className="px-4 py-4 align-top text-neutral-700 dark:text-neutral-300 font-medium">
                            {project.guide}
                          </td>

                          {/* SDG */}
                          <td className="px-4 py-4 align-top max-w-[200px] whitespace-normal">
                            {project.sdg ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800/50">
                                {formatSDG(project.sdg)}
                              </span>
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <span className="text-4xl">📭</span>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                              No matches found
                            </h3>
                            <p className="text-sm text-neutral-500">
                              Try adjusting your search criteria.
                            </p>
                            <button
                              onClick={() => {
                                setSearchTerm("");
                                setSelectedDepartment(null);
                              }}
                              className="mt-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-80 transition"
                            >
                              Reset Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </AnimatePresence>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
