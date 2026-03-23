"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Image from "next/image";
import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";
import rblGroupsRaw from "./RBL_NBA_groups.json";
const rblGroups = rblGroupsRaw;

export default function ProjectTable() {
  const [scrollY, setScrollY] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);

  React.useEffect(() => {
    let animationFrameId: number | null = null;

    const handleScroll = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        animationFrameId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Stats calculation
  const teACount = rblGroups.filter((g) => g.groupId.startsWith("A")).length;
  const teBCount = rblGroups.filter((g) => g.groupId.startsWith("B")).length;
  const teCCount = rblGroups.filter((g) => g.groupId.startsWith("C")).length;
  const totalCount = rblGroups.length;

  // Filter logic
  const filteredGroups = React.useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return rblGroups.filter((group) => {
      const matchesSearch =
        group.title.toLowerCase().includes(searchLower) ||
        group.guide.toLowerCase().includes(searchLower) ||
        group.students.some((s) => s.name.toLowerCase().includes(searchLower));

      const matchesFilter =
        !selectedGroup || group.groupId.startsWith(selectedGroup);

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedGroup]);
  return (
    <div className="relative w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans">
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="absolute top-6 left-6 z-40">
        <div className="bg-white/80 dark:bg-black/80 p-2 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 w-fit backdrop-blur-xl">
          <Image
            src="/tcetlogo.png"
            alt="TCET Logo"
            width={64}
            height={64}
            unoptimized
            className="object-contain w-10 h-10 md:w-12 md:h-12"
          />
        </div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 h-24 pointer-events-none">
        <div className="relative w-full max-w-7xl mx-auto h-full px-6">
          <div className="pointer-events-auto">
            <FloatingPillNavbar />
          </div>
        </div>
      </div>

      <ThemeToggle />

      <div className="relative w-full max-w-7xl mx-auto px-6 pb-12 pt-32 space-y-12 text-neutral-800 dark:text-neutral-100">
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
              project titles, and assigned guides.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4"
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

          <select
            value={selectedGroup || ""}
            onChange={(e) => setSelectedGroup(e.target.value || null)}
            className="px-4 py-3 w-full md:w-48 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-white font-medium outline-none cursor-pointer focus:border-emerald-500 transition-colors"
          >
            <option value="">All Groups</option>
            <option value="A">Class A</option>
            <option value="B">Class B</option>
            <option value="C">Class C</option>
          </select>
        </motion.div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
          Showing <span className="font-bold">{filteredGroups.length}</span> of{" "}
          <span className="font-bold">{totalCount}</span> projects
        </p>

        <motion.div
          style={{
            scale: Math.min(1, 0.95 + scrollY / 3000),
            opacity: Math.max(0.5, 1 - scrollY / 1500),
          }}
          className="origin-top"
        >
          <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
            <div className="w-full overflow-x-auto max-h-[70vh]">
              <table
                className="w-full text-left text-sm"
                style={{ minWidth: "800px" }}
              >
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 sticky top-0 z-20 shadow-sm">
                  <tr>
                    <th className="px-4 py-4 font-semibold w-24">Group</th>
                    <th className="px-4 py-4 font-semibold w-72">Project</th>
                    <th className="px-4 py-4 font-semibold w-56">Students</th>
                    <th className="px-4 py-4 font-semibold w-48">Guide</th>
                  </tr>
                </thead>

                <AnimatePresence>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group, idx) => (
                        <motion.tr
                          key={group.groupId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                          className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group/row"
                        >
                          <td className="px-4 py-4 align-top">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold">
                              {group.groupId}
                            </span>
                          </td>

                          <td className="px-4 py-4 align-top">
                            <p className="font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                              {group.title}
                            </p>
                          </td>

                          <td className="px-4 py-4 align-top">
                            <ul className="space-y-1">
                              {group.students.map((student) => (
                                <li
                                  key={`${group.groupId}-${student.rollNo}`}
                                  className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2"
                                >
                                  <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
                                    {student.rollNo}
                                  </span>
                                  <span className="font-medium group-hover/row:text-neutral-900 dark:group-hover/row:text-neutral-200 transition-colors">
                                    {student.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </td>

                          <td className="px-4 py-4 align-top text-neutral-600 dark:text-neutral-400 font-medium">
                            {group.guide}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-16 text-center">
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
                                setSelectedGroup(null);
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
