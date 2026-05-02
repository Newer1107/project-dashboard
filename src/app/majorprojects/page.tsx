// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import ThemeToggle from "@/components/ui/ThemeToggle";
// import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";
// import Footer from "@/components/ui/Footer";

// // Parsed and categorized B.E. Project Data
// import beProjects from "./BE_NBA_groups.json";

// export default function CapstoneProjectTable() {
//   const [scrollY, setScrollY] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedClass, setSelectedClass] = useState<string | null>(null);
//   const [selectedSdg, setSelectedSdg] = useState<number | null>(null);

//   // Scroll listener for table effect
//   useEffect(() => {
//     let animationFrameId: number | null = null;

//     const handleScroll = () => {
//       if (animationFrameId !== null) return;

//       animationFrameId = window.requestAnimationFrame(() => {
//         setScrollY(window.scrollY);
//         animationFrameId = null;
//       });
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });

//     return () => {
//       if (animationFrameId !== null)
//         window.cancelAnimationFrame(animationFrameId);

//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   // Compute unique SDGs and their counts dynamically for the interactive ribbon
//   const sdgMetrics = useMemo(() => {
//     const counts: Record<number, { title: string; count: number }> = {};

//     beProjects.forEach((p) => {
//       if (!counts[p.sdg]) {
//         counts[p.sdg] = { title: p.sdgTitle, count: 0 };
//       }

//       counts[p.sdg].count += 1;
//     });

//     return Object.entries(counts)
//       .map(([sdg, data]) => ({ sdg: Number(sdg), ...data }))
//       .sort((a, b) => b.count - a.count); // Sort by most popular
//   }, []);

//   // Filtering Logic
//   const filteredGroups = useMemo(() => {
//     const searchLower = searchTerm.toLowerCase();

//     return beProjects.filter((group) => {
//       const matchesSearch =
//         group.title.toLowerCase().includes(searchLower) ||
//         group.guide.toLowerCase().includes(searchLower) ||
//         group.domain.toLowerCase().includes(searchLower) ||
//         group.students.some((s) => s.name.toLowerCase().includes(searchLower));

//       const matchesClass =
//         !selectedClass || group.groupId.startsWith(selectedClass);

//       const matchesSdg = !selectedSdg || group.sdg === selectedSdg;

//       return matchesSearch && matchesClass && matchesSdg;
//     });
//   }, [searchTerm, selectedClass, selectedSdg]);

//   return (
//     <div className="relative w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans">
//       {/* ===== AMBIENT BACKGROUND ===== */}
//       <div className="fixed inset-0 -z-20 overflow-hidden">
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
//       </div>

//       <div className="fixed top-0 left-0 right-0 z-50 h-24 pointer-events-none">
//         <div className="relative w-full max-w-7xl mx-auto h-full px-6">
//           <div className="pointer-events-auto">
//             <FloatingPillNavbar />
//           </div>
//         </div>
//       </div>

//       <ThemeToggle />

//       <div className="relative w-full max-w-7xl mx-auto px-6 pb-12 pt-32 space-y-12 text-neutral-800 dark:text-neutral-100">
//         {/* ===== HERO SECTION ===== */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="space-y-6"
//         >
//           <div className="space-y-3">
//             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
//               Major Projects <br />
//             </h1>

//             <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl text-lg leading-relaxed">
//               Explore the major projects from TCET's final year students.
//               Discover how these multidomain applications map directly to the
//               United Nations Sustainable Development Goals.
//             </p>
//           </div>
//         </motion.div>

//         {/* ===== UNIQUE FEATURE: SDG IMPACT RIBBON ===== */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//           className="space-y-3"
//         >
//           <div className="flex items-center justify-between">
//             <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest flex items-center gap-2">
//               <svg
//                 className="w-4 h-4 text-emerald-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 10V3L4 14h7v7l9-11h-7z"
//                 />
//               </svg>
//               Filter by SDG Impact
//             </h3>

//             {selectedSdg && (
//               <button
//                 onClick={() => setSelectedSdg(null)}
//                 className="text-xs text-red-500 hover:text-red-600 font-semibold"
//               >
//                 Clear SDG Filter ×
//               </button>
//             )}
//           </div>

//           <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide snap-x">
//             {sdgMetrics.map((item) => {
//               const isActive = selectedSdg === item.sdg;

//               return (
//                 <button
//                   key={item.sdg}
//                   onClick={() => setSelectedSdg(isActive ? null : item.sdg)}
//                   className={`snap-start flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
//                     isActive
//                       ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-md shadow-emerald-500/20"
//                       : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-emerald-300 dark:hover:border-emerald-700"
//                   }`}
//                 >
//                   <div
//                     className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isActive ? "bg-emerald-500 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}
//                   >
//                     {item.sdg}
//                   </div>

//                   <div className="text-left">
//                     <p
//                       className={`text-xs font-bold ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-neutral-800 dark:text-neutral-200"}`}
//                     >
//                       {item.title}
//                     </p>

//                     <p className="text-[10px] text-neutral-500 font-medium">
//                       {item.count} {item.count === 1 ? "Project" : "Projects"}
//                     </p>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </motion.div>

//         {/* ===== SEARCH & FILTER CONTROLS ===== */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.6 }}
//           className="flex flex-col md:flex-row gap-4"
//         >
//           {/* SEARCH BOX */}
//           <div className="relative flex-1 group">
//             <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300 -z-10"></div>

//             <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl focus-within:border-emerald-500 transition-colors">
//               <svg
//                 className="w-5 h-5 text-neutral-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>

//               <input
//                 type="text"
//                 placeholder="Search projects, domains, or students..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="flex-1 bg-transparent outline-none text-neutral-900 dark:text-white placeholder-neutral-500"
//               />
//             </div>
//           </div>

//           {/* CLASS FILTER */}
//           <select
//             value={selectedClass || ""}
//             onChange={(e) => setSelectedClass(e.target.value || null)}
//             className="px-4 py-3 w-full md:w-48 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-white font-medium outline-none cursor-pointer focus:border-emerald-500 transition-colors"
//           >
//             <option value="">All Classes</option>
//             <option value="A">Class A</option>
//             <option value="B">Class B</option>
//             <option value="C">Class C</option>
//           </select>
//         </motion.div>

//         {/* ===== DATA TABLE ===== */}
//         <motion.div
//           style={{
//             scale: Math.min(1, 0.95 + scrollY / 3000),
//             opacity: Math.max(0.5, 1 - scrollY / 1500),
//           }}
//           className="origin-top"
//         >
//           <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
//             <div className="w-full overflow-x-auto max-h-[70vh]">
//               <table
//                 className="w-full text-left text-sm"
//                 style={{ minWidth: "1350px" }}
//               >
//                 <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 sticky top-0 z-20 shadow-sm whitespace-nowrap">
//                   <tr>
//                     <th className="px-4 py-4 font-semibold w-20">Group</th>
//                     <th className="px-4 py-4 font-semibold min-w-[300px]">
//                       Project & Domain
//                     </th>
//                     <th className="px-4 py-4 font-semibold w-24">Type</th>
//                     <th className="px-4 py-4 font-semibold w-32">Category</th>
//                     <th className="px-4 py-4 font-semibold w-32">
//                       Application
//                     </th>
//                     <th className="px-4 py-4 font-semibold w-32">Outcome</th>
//                     <th className="px-4 py-4 font-semibold w-32">
//                       PO/PSO Mapping
//                     </th>
//                     <th className="px-4 py-4 font-semibold w-48">Students</th>
//                     <th className="px-4 py-4 font-semibold w-40">Guide</th>
//                     <th className="px-4 py-4 font-semibold w-32">SDG</th>
//                   </tr>
//                 </thead>

//                 <AnimatePresence>
//                   <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
//                     {filteredGroups.length > 0 ? (
//                       filteredGroups.map((group, idx) => (
//                         <motion.tr
//                           key={group.groupId}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, scale: 0.95 }}
//                           transition={{ delay: Math.min(idx * 0.05, 0.5) }}
//                           className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group/row"
//                         >
//                           {/* Group ID */}
//                           <td className="px-4 py-4 align-top">
//                             <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold">
//                               {group.groupId}
//                             </span>
//                           </td>

//                           {/* Title & Domain */}
//                           <td className="px-4 py-4 align-top space-y-2">
//                             <p className="font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
//                               {group.title}
//                             </p>

//                             <span className="inline-block px-2 py-1 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 uppercase tracking-wider">
//                               {group.domain}
//                             </span>
//                           </td>

//                           {/* New Fields */}
//                           <td className="px-4 py-4 align-top">
//                             <span className="inline-block px-2 py-1 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
//                               {group.type}
//                             </span>
//                           </td>
//                           <td className="px-4 py-4 align-top text-xs font-semibold text-neutral-600 dark:text-neutral-300">
//                             {group.category}
//                           </td>
//                           <td className="px-4 py-4 align-top text-xs text-neutral-600 dark:text-neutral-400">
//                             {group.projectApplication}
//                           </td>
//                           <td className="px-4 py-4 align-top text-xs text-neutral-600 dark:text-neutral-400">
//                             {group.expectedOutcome}
//                           </td>
//                           <td className="px-4 py-4 align-top">
//                             <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
//                               <p>
//                                 <strong className="text-neutral-900 dark:text-neutral-200">
//                                   PO:
//                                 </strong>{" "}
//                                 {group.poMapped}
//                               </p>
//                               <p>
//                                 <strong className="text-neutral-900 dark:text-neutral-200">
//                                   PSO:
//                                 </strong>{" "}
//                                 {group.psoMapped}
//                               </p>
//                             </div>
//                           </td>

//                           {/* Students List */}
//                           <td className="px-4 py-4 align-top">
//                             <ul className="space-y-1">
//                               {group.students.map((student) => (
//                                 <li
//                                   key={student.rollNo}
//                                   className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2"
//                                 >
//                                   <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
//                                     {student.rollNo}
//                                   </span>
//                                   <span className="font-medium group-hover/row:text-neutral-900 dark:group-hover/row:text-neutral-200 transition-colors">
//                                     {student.name}
//                                   </span>
//                                 </li>
//                               ))}
//                             </ul>
//                           </td>

//                           {/* Guide */}
//                           <td className="px-4 py-4 align-top text-neutral-600 dark:text-neutral-400 font-medium">
//                             {group.guide}
//                           </td>

//                           {/* SDG Impact Badge */}
//                           <td className="px-4 py-4 align-top">
//                             <div
//                               className="flex items-center gap-2 group cursor-help"
//                               title={group.sdgTitle}
//                             >
//                               <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-black text-xs ring-2 ring-transparent group-hover:ring-emerald-400 transition-all">
//                                 {group.sdg}
//                               </span>
//                               <span className="text-xs font-semibold text-neutral-500 line-clamp-2">
//                                 {group.sdgTitle}
//                               </span>
//                             </div>
//                           </td>
//                         </motion.tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={10} className="px-4 py-16 text-center">
//                           <div className="flex flex-col items-center justify-center space-y-3">
//                             <span className="text-4xl">📭</span>
//                             <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
//                               No matches found
//                             </h3>
//                             <p className="text-sm text-neutral-500">
//                               Try adjusting your search criteria or clearing the
//                               SDG filter.
//                             </p>
//                             <button
//                               onClick={() => {
//                                 setSearchTerm("");
//                                 setSelectedClass(null);
//                                 setSelectedSdg(null);
//                               }}
//                               className="mt-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-80 transition"
//                             >
//                               Reset Filters
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </AnimatePresence>
//               </table>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import Footer from "@/components/ui/Footer"; // Uncomment if using

// Parsed and categorized Project Data
import beProjects from "./BE_NBA_groups.json";
import itResearchData from "./all-dep-data.json";
import statisticsData from "./statistics.json";

// Fallback mapping since new JSON only contains SDG numbers
const SDG_MAP: Record<number, string> = {
  1: "No Poverty",
  2: "Zero Hunger",
  3: "Good Health and Well-being",
  4: "Quality Education",
  5: "Gender Equality",
  6: "Clean Water and Sanitation",
  7: "Affordable and Clean Energy",
  8: "Decent Work and Economic Growth",
  9: "Industry, Innovation and Infrastructure",
  10: "Reduced Inequalities",
  11: "Sustainable Cities and Communities",
  12: "Responsible Consumption and Production",
  13: "Climate Action",
  14: "Life Below Water",
  15: "Life on Land",
  16: "Peace, Justice and Strong Institutions",
  17: "Partnerships for the Goals",
  77: "Custom / Local Goal", // MME Dept raw data contained this
  79: "Custom / Local Goal", // MME Dept raw data contained this
};

export default function CapstoneProjectTable() {
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSdg, setSelectedSdg] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null,
  );
  const [selectedResearchBranch, setSelectedResearchBranch] = useState<string | null>(null);
  const [selectedResearchDomain, setSelectedResearchDomain] = useState<string | null>(null);
  const [researchSearchQuery, setResearchSearchQuery] = useState("");

  // Statistics states
  const [selectedStatsClass, setSelectedStatsClass] = useState<string | null>(null);
  const [selectedStatsDomain, setSelectedStatsDomain] = useState<string | null>(null);
  const [statsSearchQuery, setStatsSearchQuery] = useState("");

  function getBranchFromGroupId(groupId: string) {
    return groupId.split("-")[0]?.trim() || groupId;
  }

  // Scroll listener for table effect
  useEffect(() => {
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

  // Extract unique departments for the dropdown
  // Extract unique departments for the dropdown
  const uniqueDepartments = useMemo(() => {
    // We add `as string[]` to strictly type the filtered array, removing 'undefined'
    const validDepts = beProjects
      .map((p) => p.department)
      .filter((dept) => typeof dept === "string") as string[];

    const depts = new Set(validDepts);
    depts.add("COMP"); // Always include COMP as it's used as fallback
    return Array.from(depts).sort();
  }, []);

  // Compute unique SDGs and their counts dynamically for the interactive ribbon
  const sdgMetrics = useMemo(() => {
    const counts: Record<number, { title: string; count: number }> = {};

    beProjects.forEach((p) => {
      if (!p.sdg) return; // Skip if no SDG is mapped
      if (!counts[p.sdg]) {
        // Use fallback mapping if title is missing
        counts[p.sdg] = {
          title: p.sdgTitle || SDG_MAP[p.sdg] || `Goal ${p.sdg}`,
          count: 0,
        };
      }
      counts[p.sdg].count += 1;
    });

    return Object.entries(counts)
      .map(([sdg, data]) => ({ sdg: Number(sdg), ...data }))
      .sort((a, b) => b.count - a.count); // Sort by most popular
  }, []);

  // Filtering Logic
  const filteredGroups = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return beProjects.filter((group) => {
      // Safely handle missing array/string fields
      const titleMatch =
        group.title?.toLowerCase().includes(searchLower) || false;
      const guideMatch =
        group.guide?.toLowerCase().includes(searchLower) || false;
      const domainMatch =
        group.domain?.toLowerCase().includes(searchLower) || false;
      const deptMatchSearch =
        group.department?.toLowerCase().includes(searchLower) || false;
      const studentMatch =
        group.students?.some((s) =>
          s.name?.toLowerCase().includes(searchLower),
        ) || false;

      const matchesSearch =
        titleMatch ||
        guideMatch ||
        domainMatch ||
        deptMatchSearch ||
        studentMatch;

      // Class matching is tricky with new group IDs (e.g. "G1", "1", "AI&DS2026A01")
      // We look for the class letter inside the ID
      const matchesClass =
        !selectedClass || group.groupId?.includes(selectedClass);

      const matchesSdg = !selectedSdg || group.sdg === selectedSdg;
      const matchesDepartment =
        !selectedDepartment ||
        group.department === selectedDepartment ||
        (selectedDepartment === "COMP" && !group.department);

      return matchesSearch && matchesClass && matchesSdg && matchesDepartment;
    });
  }, [searchTerm, selectedClass, selectedSdg, selectedDepartment]);

  // Research data filtering
  const filteredResearch = useMemo(() => {
    const searchLower = researchSearchQuery.toLowerCase();
    return itResearchData.filter((group) => {
      const matchesSearch =
        group.title.toLowerCase().includes(searchLower) ||
        group.guide.toLowerCase().includes(searchLower) ||
        group.domain.toLowerCase().includes(searchLower) ||
        group.students.some((name: string) => name.toLowerCase().includes(searchLower));

      const matchesBranch =
        !selectedResearchBranch || getBranchFromGroupId(group.groupId) === selectedResearchBranch;

      const matchesDomain =
        !selectedResearchDomain || group.domain === selectedResearchDomain;

      return matchesSearch && matchesBranch && matchesDomain;
    });
  }, [researchSearchQuery, selectedResearchBranch, selectedResearchDomain]);

  const researchBranches = useMemo(() => {
    return Array.from(
      new Set(itResearchData.map((group) => getBranchFromGroupId(group.groupId)))
    ).sort();
  }, []);

  const researchDomains = useMemo(() => {
    return Array.from(new Set(itResearchData.map((group) => group.domain))).sort();
  }, []);

  // Statistics memos
  function getStatsClass(classDiv: string): string {
    return classDiv.charAt(0) || '';
  }

  const statsClasses = useMemo(() => {
    const classes = new Set<string>();
    statisticsData.forEach((group) => {
      group.students.forEach((student: any) => {
        if (student.classDiv) classes.add(getStatsClass(student.classDiv));
      });
    });
    return Array.from(classes).sort();
  }, []);

  const statsDomains = useMemo(() => {
    return Array.from(new Set(statisticsData.map((group: any) => group.domain))).sort();
  }, []);

  const filteredStatistics = useMemo(() => {
    const searchLower = statsSearchQuery.toLowerCase();
    return statisticsData.filter((group: any) => {
      const matchesSearch =
        group.projectTitle.toLowerCase().includes(searchLower) ||
        group.guide.toLowerCase().includes(searchLower) ||
        group.domain.toLowerCase().includes(searchLower) ||
        group.students.some((s: any) => s.name.toLowerCase().includes(searchLower));

      const matchesClass =
        !selectedStatsClass || group.students.some((s: any) => getStatsClass(s.classDiv) === selectedStatsClass);

      const matchesDomain = !selectedStatsDomain || group.domain === selectedStatsDomain;

      return matchesSearch && matchesClass && matchesDomain;
    });
  }, [statsSearchQuery, selectedStatsClass, selectedStatsDomain]);

  return (
    <div className="relative w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans">
      {/* ===== AMBIENT BACKGROUND ===== */}
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

      <div className="relative w-full max-w-7xl mx-auto px-6 pb-12 pt-32 space-y-12 text-neutral-800 dark:text-neutral-100">
        {/* ===== HERO SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
              Major Projects <br />
            </h1>

            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl text-lg leading-relaxed">
              Explore the major projects, research, and statistics from final year students across all departments. Discover how these multidomain applications map directly to the United Nations Sustainable Development Goals.
            </p>
          </div>
        </motion.div>

        {/* ===== UNIQUE FEATURE: SDG IMPACT RIBBON ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Filter by SDG Impact
            </h3>

            {selectedSdg && (
              <button
                onClick={() => setSelectedSdg(null)}
                className="text-xs text-red-500 hover:text-red-600 font-semibold"
              >
                Clear SDG Filter ×
              </button>
            )}
          </div>

          <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide snap-x">
            {sdgMetrics.map((item) => {
              const isActive = selectedSdg === item.sdg;

              return (
                <button
                  key={item.sdg}
                  onClick={() => setSelectedSdg(isActive ? null : item.sdg)}
                  className={`snap-start flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-md shadow-emerald-500/20"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-emerald-300 dark:hover:border-emerald-700"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isActive ? "bg-emerald-500 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}
                  >
                    {item.sdg}
                  </div>

                  <div className="text-left">
                    <p
                      className={`text-xs font-bold ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-neutral-800 dark:text-neutral-200"}`}
                    >
                      {item.title}
                    </p>

                    <p className="text-[10px] text-neutral-500 font-medium">
                      {item.count} {item.count === 1 ? "Project" : "Projects"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ===== SEARCH & FILTER CONTROLS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4"
        >
          {/* SEARCH BOX */}
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
                placeholder="Search projects, domains, departments, or students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-neutral-900 dark:text-white placeholder-neutral-500"
              />
            </div>
          </div>

          {/* DEPARTMENT FILTER */}
          {/* DEPARTMENT FILTER */}
          <Select
            value={selectedDepartment || "all"}
            onValueChange={(value) =>
              setSelectedDepartment(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full md:w-48 h-auto px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-white font-medium outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl">
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* CLASS FILTER */}
          <Select
            value={selectedClass || "all"}
            onValueChange={(value) =>
              setSelectedClass(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full md:w-40 h-auto px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-white font-medium outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl">
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="A">Class A</SelectItem>
              <SelectItem value="B">Class B</SelectItem>
              <SelectItem value="C">Class C</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* ===== DATA TABLE ===== */}
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
                style={{ minWidth: "1450px" }}
              >
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 sticky top-0 z-20 shadow-sm whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-4 font-semibold w-24">
                      Dept & Group
                    </th>
                    <th className="px-4 py-4 font-semibold min-w-[300px]">
                      Project & Domain
                    </th>
                    <th className="px-4 py-4 font-semibold w-24">Type</th>
                    <th className="px-4 py-4 font-semibold w-32">Category</th>
                    <th className="px-4 py-4 font-semibold w-32">
                      Application
                    </th>
                    <th className="px-4 py-4 font-semibold w-32">Outcome</th>
                    <th className="px-4 py-4 font-semibold w-48">Students</th>
                    <th className="px-4 py-4 font-semibold w-40">Guide</th>
                    <th className="px-4 py-4 font-semibold w-32">SDG</th>
                  </tr>
                </thead>

                <AnimatePresence>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group, idx) => (
                        <motion.tr
                          key={`${group.department}-${group.groupId}-${idx}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                          className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group/row"
                        >
                          {/* Dept & Group ID */}
                          <td className="px-4 py-4 align-top">
                            <div className="flex flex-col gap-1.5">
                              <span className="inline-block px-2 py-1 rounded text-[10px] font-bold bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 uppercase text-center">
                                {group.department || "COMP"}
                              </span>
                              <span className="inline-flex items-center justify-center w-full py-1.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold border border-neutral-200 dark:border-neutral-700">
                                {group.groupId}
                              </span>
                            </div>
                          </td>

                          {/* Title & Domain */}
                          <td className="px-4 py-4 align-top space-y-2">
                            <p className="font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                              {group.title}
                            </p>

                            <span className="inline-block px-2 py-1 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                              {group.domain}
                            </span>
                          </td>

                          {/* New Fields */}
                          <td className="px-4 py-4 align-top">
                            <span className="inline-block px-2 py-1 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                              {group.type || "Inhouse"}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-top text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                            {group.category || "-"}
                          </td>
                          <td className="px-4 py-4 align-top text-xs text-neutral-600 dark:text-neutral-400">
                            {group.projectApplication || "-"}
                          </td>
                          <td className="px-4 py-4 align-top text-xs text-neutral-600 dark:text-neutral-400">
                            {group.expectedOutcome || "-"}
                          </td>

                          {/* Students List */}
                          <td className="px-4 py-4 align-top">
                            <ul className="space-y-1">
                              {group.students?.map((student, i) => (
                                <li
                                  key={i}
                                  className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2"
                                >
                                  <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
                                    {student.rollNo || "N/A"}
                                  </span>
                                  <span className="font-medium group-hover/row:text-neutral-900 dark:group-hover/row:text-neutral-200 transition-colors line-clamp-1">
                                    {student.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </td>

                          {/* Guide */}
                          <td className="px-4 py-4 align-top text-neutral-600 dark:text-neutral-400 font-medium">
                            {group.guide || "-"}
                          </td>

                          {/* SDG Impact Badge */}
                          <td className="px-4 py-4 align-top">
                            {group.sdg ? (
                              <div
                                className="flex items-center gap-2 group cursor-help"
                                title={group.sdgTitle || SDG_MAP[group.sdg]}
                              >
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-black text-xs ring-2 ring-transparent group-hover:ring-emerald-400 transition-all flex-shrink-0">
                                  {group.sdg}
                                </span>
                                <span className="text-xs font-semibold text-neutral-500 line-clamp-2">
                                  {group.sdgTitle ||
                                    SDG_MAP[group.sdg] ||
                                    `Goal ${group.sdg}`}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-neutral-400">
                                -
                              </span>
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
                              Try adjusting your search criteria or clearing the
                              filters.
                            </p>
                            <button
                              onClick={() => {
                                setSearchTerm("");
                                setSelectedClass(null);
                                setSelectedSdg(null);
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

        {/* IT Research & Publication Track Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4 pt-12"
        >
          <div className="px-2">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Research & Publication Track
            </h2>
            <p className="text-neutral-500 text-sm">Detailed publication status, TRL levels, and technical innovation.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 px-2">
            <select
              value={selectedResearchBranch || ""}
              onChange={(e) => setSelectedResearchBranch(e.target.value || null)}
              className="px-4 py-3 w-full md:w-56 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-white font-medium outline-none cursor-pointer focus:border-blue-500 transition-colors"
            >
              <option value="">All Branches</option>
              {researchBranches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>

            <select
              value={selectedResearchDomain || ""}
              onChange={(e) => setSelectedResearchDomain(e.target.value || null)}
              className="px-4 py-3 w-full md:w-64 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-white font-medium outline-none cursor-pointer focus:border-blue-500 transition-colors"
            >
              <option value="">All Domains</option>
              {researchDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>

            <div className="relative w-full md:w-auto flex-1 group">
              <input
                type="text"
                placeholder="Search research..."
                value={researchSearchQuery}
                onChange={(e) => setResearchSearchQuery(e.target.value)}
                className="block w-full px-4 py-3 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all"
              />
            </div>

            {(selectedResearchBranch || selectedResearchDomain || researchSearchQuery) && (
              <button
                onClick={() => {
                  setSelectedResearchBranch(null);
                  setSelectedResearchDomain(null);
                  setResearchSearchQuery("");
                }}
                className="px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
            <div className="w-full overflow-x-auto max-h-[70vh]">
              <table className="w-full text-left text-sm" style={{ minWidth: "1800px" }}>
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 sticky top-0 z-20 shadow-sm whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-4 font-semibold w-40">Group Name</th>
                    <th className="px-4 py-4 font-semibold w-64">Student Names</th>
                    <th className="px-4 py-4 font-semibold min-w-[300px]">Project Title</th>
                    <th className="px-4 py-4 font-semibold w-40">Name of Guide</th>
                    <th className="px-4 py-4 font-semibold w-48">Domains / Sectors</th>
                    <th className="px-4 py-4 font-semibold w-44">Multicon-W 2026</th>
                    <th className="px-4 py-4 font-semibold w-40">Outside Conference</th>
                    <th className="px-4 py-4 font-semibold w-40">Peer Review Journal</th>
                    <th className="px-4 py-4 font-semibold w-24 text-center">TRL</th>
                    <th className="px-4 py-4 font-semibold w-64">Achievements / Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                  {filteredResearch.length > 0 ? (
                    filteredResearch.map((group) => (
                      <tr key={`research-${group.groupId}`} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group/row">
                        <td className="px-4 py-4 align-top font-mono font-bold text-blue-600 dark:text-blue-400">
                          {group.groupId}
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-col gap-1">
                            {group.students.map((name: string, i: number) => (
                              <span key={i} className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{name}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                          {group.title}
                        </td>
                        <td className="px-4 py-4 align-top text-neutral-600 dark:text-neutral-400">{group.guide}</td>
                        <td className="px-4 py-4 align-top">
                          <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">{group.domain}</span>
                        </td>
                        <td className="px-4 py-4 align-top text-xs italic text-neutral-500">{group.multiconW}</td>
                        <td className="px-4 py-4 align-top text-xs">
                          {group.outsideConf !== "-" ? (
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">{group.outsideConf}</span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-4 align-top">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${group.journal !== "-" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700" : "text-neutral-400"}`}>
                            {group.journal}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-top text-center">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-800">
                            {group.trl}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 hover:line-clamp-none transition-all">{group.impact}</p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="text-4xl">📭</span>
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No matches found</h3>
                          <p className="text-sm text-neutral-500">Try adjusting your search, branch, or domain filters.</p>
                          <button
                            onClick={() => {
                              setResearchSearchQuery("");
                              setSelectedResearchBranch(null);
                              setSelectedResearchDomain(null);
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
              </table>
            </div>
          </div>
        </motion.div>

        {/* Statistics & Publications Table */}
        <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="space-y-4 pt-12"
>
  <div className="px-2">
    <h2 className="text-2xl font-bold flex items-center gap-3">
      <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
      Statistics & Publications
    </h2>
    <p className="text-neutral-500 text-sm">Publication achievements, TRL levels, conferences, journals, and awards.</p>
  </div>

  <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
    <div className="w-full overflow-x-auto max-h-[70vh]">
      <table className="w-full text-left text-sm" style={{ minWidth: "1600px" }}>
        <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 sticky top-0 z-20 shadow-sm whitespace-nowrap">
          <tr>
            <th className="px-4 py-4 font-semibold w-32 text-center">Class</th>
            <th className="px-4 py-4 font-semibold w-64">Students Name</th>
            <th className="px-4 py-4 font-semibold min-w-[350px]">Project Title</th>
            <th className="px-4 py-4 font-semibold w-48">Guide</th>
            <th className="px-4 py-4 font-semibold w-48">Domain</th>
            <th className="px-4 py-4 font-semibold w-48">Conference</th>
            <th className="px-4 py-4 font-semibold w-44">Journal/Scopus</th>
            <th className="px-4 py-4 font-semibold w-24 text-center">TRL</th>
            <th className="px-4 py-4 font-semibold w-64">Achievements/Other</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
          {filteredStatistics.length > 0 ? (
            filteredStatistics.map((group: any, idx: number) => (
              <motion.tr
                key={`stats-${group.projectTitle}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group/row"
              >

                {/* CLASS */}
                <td className="px-4 py-4 align-top text-center font-bold text-indigo-600 dark:text-indigo-400">
                  {group.students?.[0]?.classDiv || '-'}
                </td>

                {/* STUDENTS NAME*/}
                <td className="px-4 py-4 align-top">
                  <div className="flex flex-col gap-1 text-xs">
                    {group.students.map((s: any, i: number) => (
                      <span key={i} className="font-medium text-neutral-700 dark:text-neutral-300">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </td>

                {/* PROJECT TITLE */}
                <td className="px-4 py-4 align-top font-bold text-neutral-900 dark:text-neutral-100 leading-tight line-clamp-2">
                  {group.projectTitle}
                </td>

                {/* GUIDE */}
                <td className="px-4 py-4 align-top text-neutral-600 dark:text-neutral-400 font-medium">
                  {group.guide}
                </td>

                {/* DOMAIN */}
                <td className="px-4 py-4 align-top">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                    {group.domain}
                  </span>
                </td>

                {/* CONFERENCE */}
                <td className="px-4 py-4 align-top text-xs">
                  {group.conference && group.conference !== '-' ? (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {group.conference}
                    </span>
                  ) : group.presentation === 'Presented' ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Presented</span>
                  ) : '—'}
                </td>

                {/* JOURNAL / SCOPUS */}
                <td className="px-4 py-4 align-top text-xs">
                  {group.journal && group.journal !== '-' ? (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {group.journal}
                    </span>
                  ) : group.scopus ? (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {group.scopus}
                    </span>
                  ) : '—'}
                </td>

                {/* TRL */}
                <td className="px-4 py-4 align-top text-center">
                  {group.trl ? (
                    <span className="text-orange-600 dark:text-orange-400 font-bold">
                      T{group.trl}
                    </span>
                  ) : (
                    <span className="text-neutral-400 text-xs">—</span>
                  )}
                </td>

                {/* ACHIEVEMENTS */}
                <td className="px-4 py-4 align-top">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 line-clamp-3">
                    {group.achievement && <p><strong>Achievement:</strong> {group.achievement}</p>}
                    {group.other && <p><strong>Other:</strong> {group.other}</p>}
                  </div>
                </td>

              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="text-4xl">📊</span>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    No statistics matches found
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Try adjusting your search, class, or domain filters.
                  </p>
                    </div>
                    </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
