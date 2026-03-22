"use client";

import React, { useMemo, useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import ThemeToggle from "@/components/ui/ThemeToggle";

import Image from "next/image";

import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";

import Footer from "@/components/ui/Footer";

// Parsed and categorized B.E. Project Data

const beProjects = [
  // ================= BE COMP A =================

  {
    groupId: "A1",

    guide: "Ms. Loukik S",

    domain: "Intelligent System Design and Development",

    sdg: 3,

    sdgTitle: "Good Health and Well-being",

    title: "Early Detection of Pancreatic Cancer using AI",

    students: [
      { rollNo: 22, name: "Ragini Gaggar" },

      { rollNo: 34, name: "Vishal Gupta" },

      { rollNo: 35, name: "Aishwarya Jadhav" },
    ],
  },

  {
    groupId: "A3",

    guide: "Mrs. Veena Kulkarni",

    domain: "Intelligent System Design and Development",

    sdg: 17,

    sdgTitle: "Partnerships for the Goals",

    title: "AI-Based Skill Gap Analyzer",

    students: [
      { rollNo: 18, name: "Sachinandan Dash" },

      { rollNo: 14, name: "Prajot Dabre" },

      { rollNo: 2, name: "Anush Anchan" },
    ],
  },

  {
    groupId: "A7",

    guide: "Ms. Pratiksha D",

    domain: "Intelligent System Design and Development",

    sdg: 12,

    sdgTitle: "Responsible Consumption and Production",

    title:
      "Smart Farming Assistant: Fertilizer Prediction Based on Soil and Crop Data",

    students: [
      { rollNo: 43, name: "Sanjog Karan" },

      { rollNo: 37, name: "Vinay Jayswal" },

      { rollNo: 60, name: "Aman Maurya" },
    ],
  },

  {
    groupId: "A13",

    guide: "Mrs. Vinitta Sunish",

    domain: "Computing and System Design",

    sdg: 11,

    sdgTitle: "Sustainable Cities and Communities",

    title:
      "Intelligent embedded system for passbox control using stm32 microcontroller",

    students: [
      { rollNo: 29, name: "Mukesh Gupta" },

      { rollNo: 30, name: "Nikhil Gupta" },

      { rollNo: 21, name: "Dibya Jyoti Dutta" },
    ],
  },

  {
    groupId: "A15",

    guide: "Mrs. Veena Kulkarni",

    domain: "Computing and System Design",

    sdg: 8,

    sdgTitle: "Decent Work and Economic Growth",

    title: "Identifying Halo CME Events Based on Particle Data from Aditya-L1",

    students: [
      { rollNo: 17, name: "Devanshu Dandekar" },

      { rollNo: 19, name: "Rohan Dhiman" },

      { rollNo: 42, name: "Rahul Kaikani" },
    ],
  },

  {
    groupId: "A17",

    guide: "Mrs. Siddhi Ambre",

    domain: "Software Development & Information System",

    sdg: 10,

    sdgTitle: "Reduced Inequalities",

    title:
      "Inclusive Connect: Bridging Accessibility for person with a disability",

    students: [
      { rollNo: 65, name: "Ashley Pow" },

      { rollNo: 66, name: "Kush Intwala" },

      { rollNo: 68, name: "Komal Joshi" },
    ],
  },

  {
    groupId: "A20",

    guide: "Ms. Hetal Rana",

    domain: "Computing and System Design",

    sdg: 8,

    sdgTitle: "Decent Work and Economic Growth",

    title: "Smart IoT Assistive Cane For Public Mobility",

    students: [
      { rollNo: 70, name: "Aditya Chaubey" },

      { rollNo: 69, name: "Shivam Thakur" },

      { rollNo: 67, name: "Yash Shah" },
    ],
  },

  {
    groupId: "A21",

    guide: "Dr. Vaishali Nirgude",

    domain: "Intelligent System Design and Development",

    sdg: 2,

    sdgTitle: "Zero Hunger",

    title:
      "AgroLens: A Novel Vision-Based System for Crop Monitoring and Weed Detection",

    students: [
      { rollNo: 46, name: "Hricha Mehra" },

      { rollNo: 51, name: "Isha Kotecha" },

      { rollNo: 45, name: "Nisarg Kasturiwale" },
    ],
  },

  {
    groupId: "A22",

    guide: "Dr. Sheetal Rathi",

    domain: "Intelligent System Design and Development",

    sdg: 2,

    sdgTitle: "Zero Hunger",

    title:
      "KissanSanjivani : An explainable AI powered mobile app for disease Management",

    students: [
      { rollNo: 50, name: "Aditya Kotian" },

      { rollNo: 63, name: "Katkade Rugved Sanjay" },

      { rollNo: 52, name: "Kulkarni Archis Avinash" },
    ],
  },

  // ================= BE COMP B =================

  {
    groupId: "B2",

    guide: "Ms. Drashti S",

    domain: "Software Development & Information System",

    sdg: 4,

    sdgTitle: "Quality Education",

    title:
      "AI-Driven Adaptive Training Platform with Digital Twin-Based Skill Gap Analysis",

    students: [
      { rollNo: 13, name: "Manasvi Nayak" },

      { rollNo: 14, name: "Pratik Neupane" },

      { rollNo: 15, name: "Pranali Pahurkar" },
    ],
  },

  {
    groupId: "B3",

    guide: "Ms. Tanmayi N",

    domain: "Computing and System Design",

    sdg: 12,

    sdgTitle: "Responsible Consumption and Production",

    title:
      "Design Smart Alert-Based Inventory System for Reducing Supermarket Food Surplus using ML",

    students: [
      { rollNo: 1, name: "Snehi Mehta" },

      { rollNo: 11, name: "Nimesh Nakhwa" },

      { rollNo: 30, name: "Aman Prajapati" },
    ],
  },

  {
    groupId: "B5",

    guide: "Dr. R. R. Sedamkar",

    domain: "Software Development & Information System",

    sdg: 4,

    sdgTitle: "Quality Education",

    title:
      "Design and development of AI driven Assessment Platform for Soft Skill Enhancement",

    students: [
      { rollNo: 4, name: "Aditya Mishra" },

      { rollNo: 16, name: "Harsh Pal" },

      { rollNo: 10, name: "Pawankumar Mudaliar" },
    ],
  },

  {
    groupId: "B6",

    guide: "Mr. Swapnil Bhagat",

    domain: "Intelligent System Design and Development",

    sdg: 9,

    sdgTitle: "Industry, Innovation and Infrastructure",

    title:
      "AuthenticityNet: Deep Learning Model for Face Image Forgery Detection",

    students: [
      { rollNo: 44, name: "Shivam Sati" },

      { rollNo: 46, name: "Meet Shah" },

      { rollNo: 38, name: "Yash Rawal" },
    ],
  },

  {
    groupId: "B8",

    guide: "Mr. Swapnil Bhagat",

    domain: "Communication Networking and Web Engineering",

    sdg: 9,

    sdgTitle: "Industry, Innovation and Infrastructure",

    title: "AI-Powered Cyber Threat Response System using Firewall",

    students: [
      { rollNo: 25, name: "Anoop Patel" },

      { rollNo: 29, name: "Karthik Prabhu" },

      { rollNo: 32, name: "Harshit Prasad" },
    ],
  },

  {
    groupId: "B13",

    guide: "Ms. Drashti S",

    domain: "Multimedia Design and Development",

    sdg: 4,

    sdgTitle: "Quality Education",

    title: "Magic Learn - DrawInAir: Redefining Creativity, Problem Solving",

    students: [
      { rollNo: 42, name: "Sudeep Sarkar" },

      { rollNo: 41, name: "Deval Saliya" },

      { rollNo: 26, name: "Hiya Patel" },
    ],
  },

  {
    groupId: "B18",

    guide: "Dr. Rashmi Thakur",

    domain: "Computing and System Design",

    sdg: 6,

    sdgTitle: "Clean Water and Sanitation",

    title: "AquaSentinel -AI powered water quality monitoring system",

    students: [
      { rollNo: 2, name: "Amanteja Metla" },

      { rollNo: 35, name: "Sahili Rane" },

      { rollNo: 19, name: "Aditi Pandey" },
    ],
  },

  // ================= BE COMP C =================

  {
    groupId: "C1",

    guide: "Dr. Megharani Patil",

    domain: "Intelligent System Design and Development",

    sdg: 16,

    sdgTitle: "Peace, Justice and Strong Institutions",

    title: "Nayay: A Multilingual AI Framework for Scalable Legal Assistance",

    students: [
      { rollNo: 9, name: "Shashank Singh" },

      { rollNo: 10, name: "Shivanshu Singh" },

      { rollNo: 28, name: "Pranay Tiwari" },
    ],
  },

  {
    groupId: "C6",

    guide: "Ms. Loukik S",

    domain: "Software Development & Information System",

    sdg: 9,

    sdgTitle: "Industry, Innovation and Infrastructure",

    title:
      "An Integrated Framework for Smart Waste Detection, Segregation, and Capacity Monitoring",

    students: [
      { rollNo: 23, name: "Purva Tijare" },

      { rollNo: 20, name: "Khushi Thakkar" },
    ],
  },

  {
    groupId: "C8",

    guide: "Mrs. Lydia Suganya",

    domain: "Communication Networking and Web Engineering",

    sdg: 16,

    sdgTitle: "Peace, Justice and Strong Institutions",

    title:
      "Development of a web application for simulating real time mock interviews using AI",

    students: [
      { rollNo: 3, name: "Dipti Singh" },

      { rollNo: 4, name: "Kashish Singh" },

      { rollNo: 70, name: "Samruddhi Kamble" },
    ],
  },

  {
    groupId: "C9",

    guide: "Dr. Preksha Pareek",

    domain: "Computing and System Design",

    sdg: 4,

    sdgTitle: "Quality Education",

    title: "AI-enabled drone detection system",

    students: [
      { rollNo: 44, name: "Abhay wadkar" },

      { rollNo: 60, name: "Shivam Yadav" },

      { rollNo: 46, name: "Samayak waghmare" },
    ],
  },

  {
    groupId: "C10",

    guide: "Dr. Sheetal Rathi",

    domain: "Communication Networking and Web Engineering",

    sdg: 15,

    sdgTitle: "Life on Land",

    title: "Animal Rescue and Adoption platform",

    students: [
      { rollNo: 61, name: "Sonam Yadav" },

      { rollNo: 17, name: "Swathi Harish" },

      { rollNo: 54, name: "Madhu Yadav" },
    ],
  },

  {
    groupId: "C22",

    guide: "Dr. Vaishali Nirgude",

    domain: "Computing and System Design",

    sdg: 9,

    sdgTitle: "Industry, Innovation and Infrastructure",

    title: "UETP: Smart Equity Trading with AI and Predictive Analytics",

    students: [
      { rollNo: 50, name: "Damodar Yadav" },

      { rollNo: 49, name: "Akash Yadav" },

      { rollNo: 52, name: "Kaushal Yadav" },
    ],
  },

  {
    groupId: "C23",

    guide: "Dr. R. R. Sedamkar",

    domain: "Software Development & Information System",

    sdg: 9,

    sdgTitle: "Industry, Innovation and Infrastructure",

    title:
      "Building a custom fuzzer to improve security of open source projects",

    students: [
      { rollNo: 38, name: "Atharva Vartak" },

      { rollNo: 22, name: "Hiral Tibrewal" },

      { rollNo: 63, name: "Vishal Yadav" },
    ],
  },
];

export default function CapstoneProjectTable() {
  const [scrollY, setScrollY] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const [selectedSdg, setSelectedSdg] = useState<number | null>(null);

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

  // Compute unique SDGs and their counts dynamically for the interactive ribbon

  const sdgMetrics = useMemo(() => {
    const counts: Record<number, { title: string; count: number }> = {};

    beProjects.forEach((p) => {
      if (!counts[p.sdg]) {
        counts[p.sdg] = { title: p.sdgTitle, count: 0 };
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
      const matchesSearch =
        group.title.toLowerCase().includes(searchLower) ||
        group.guide.toLowerCase().includes(searchLower) ||
        group.domain.toLowerCase().includes(searchLower) ||
        group.students.some((s) => s.name.toLowerCase().includes(searchLower));

      const matchesClass =
        !selectedClass || group.groupId.startsWith(selectedClass);

      const matchesSdg = !selectedSdg || group.sdg === selectedSdg;

      return matchesSearch && matchesClass && matchesSdg;
    });
  }, [searchTerm, selectedClass, selectedSdg]);

  return (
    <div className="relative w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans">
      {/* ===== AMBIENT BACKGROUND ===== */}

      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>

        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* ===== LOGO & NAVIGATION ===== */}

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
              Explore the major projects from TCET's final year students.
              Discover how these multidomain applications map directly to the
              United Nations Sustainable Development Goals.
            </p>
          </div>

          {/* STATS CARDS */}
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
                placeholder="Search projects, domains, or students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-neutral-900 dark:text-white placeholder-neutral-500"
              />
            </div>
          </div>

          {/* CLASS FILTER */}

          <select
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value || null)}
            className="px-4 py-3 w-full md:w-48 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-white font-medium outline-none cursor-pointer focus:border-emerald-500 transition-colors"
          >
            <option value="">All Classes</option>

            <option value="A">Class A</option>

            <option value="B">Class B</option>

            <option value="C">Class C</option>
          </select>
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
                style={{ minWidth: "800px" }}
              >
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 sticky top-0 z-20 shadow-sm">
                  <tr>
                    <th className="px-4 py-4 font-semibold w-24">Group</th>

                    <th className="px-4 py-4 font-semibold w-64">
                      Project & Domain
                    </th>

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
                          key={group.groupId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                          className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group/row"
                        >
                          {/* Group ID */}

                          <td className="px-4 py-4 align-top">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold">
                              {group.groupId}
                            </span>
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

                          {/* Students List */}

                          <td className="px-4 py-4 align-top">
                            <ul className="space-y-1">
                              {group.students.map((student) => (
                                <li
                                  key={student.rollNo}
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

                          {/* Guide */}

                          <td className="px-4 py-4 align-top text-neutral-600 dark:text-neutral-400 font-medium">
                            {group.guide}
                          </td>

                          {/* SDG Impact Badge */}

                          <td className="px-4 py-4 align-top">
                            <div
                              className="flex items-center gap-2 group cursor-help"
                              title={group.sdgTitle}
                            >
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-black text-xs ring-2 ring-transparent group-hover:ring-emerald-400 transition-all">
                                {group.sdg}
                              </span>

                              <span className="text-xs font-semibold text-neutral-500 line-clamp-2">
                                {group.sdgTitle}
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <span className="text-4xl">📭</span>

                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                              No matches found
                            </h3>

                            <p className="text-sm text-neutral-500">
                              Try adjusting your search criteria or clearing the
                              SDG filter.
                            </p>

                            <button
                              onClick={() => {
                                setSearchTerm("");

                                setSelectedClass(null);

                                setSelectedSdg(null);
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
