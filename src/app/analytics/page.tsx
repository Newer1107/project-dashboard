"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Image from "next/image";
import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  FolderKanban,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  Calendar,
  BarChart3,
  Target,
  Award,
  Layers,
  Briefcase,
  Search,
  X,
} from "lucide-react";

import beProjectsRaw from "../majorprojects/BE_NBA_groups.json";
import rblGroupsRaw from "../rblprojects-te/RBL_NBA_groups.json";

const beProjects = beProjectsRaw as any[];

const rblGroups = rblGroupsRaw;
// ========== COLORS ==========
const DONUT_COLORS = [
  "#6366f1",
  "#22d3ee",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
];
const AREA_GRADIENT = ["#6366f1", "#22d3ee", "#10b981"];

// ========== COMPONENT ==========
export default function AnalyticsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "be" | "rbl">(
    "overview",
  );
  const [activeFilter, setActiveFilter] = useState<{
    type: string;
    value: string;
  } | null>(null);

  // Reset filters when changing tabs
  useEffect(() => {
    setActiveFilter(null);
    setSearchQuery("");
  }, [activeTab]);

  const handleChartClick = (type: string, value: string) => {
    setActiveFilter((prev) =>
      prev?.value === value && prev?.type === type ? null : { type, value },
    );
  };

  // --- CROSS FILTERING ENGINE ---
  const { filteredBE, filteredRBL, displayProjects } = useMemo(() => {
    const keywordCategories: Record<string, string[]> = {
      "AI & Machine Learning": [
        "ai",
        "ml",
        "machine learning",
        "deep learning",
        "nlp",
        "computer vision",
        "predictive",
        "intelligent",
        "genai",
      ],
      "IoT & Smart Systems": [
        "iot",
        "smart",
        "drone",
        "embedded",
        "microcontroller",
        "stm32",
        "esp8266",
        "hardware",
        "sensor",
      ],
      "Security & Crypto": [
        "blockchain",
        "cyber",
        "security",
        "fuzzer",
        "crypto",
        "secure",
        "fraud",
        "forgery",
        "threat",
      ],
      "Data & Analytics": [
        "data",
        "analytics",
        "tracker",
        "tracking",
        "analyzer",
        "monitoring",
        "detection",
      ],
      "Platforms & Web Apps": [
        "app",
        "platform",
        "web",
        "portal",
        "dashboard",
        "system",
        "management",
      ],
    };

    const isMatch = (p: any) => {
      // 1. Check Click Filters
      let passesFilter = true;
      if (activeFilter) {
        switch (activeFilter.type) {
          case "domain":
            passesFilter = p.domain === activeFilter.value;
            break;
          case "sdg":
            passesFilter = String(p.sdg) === activeFilter.value;
            break;
          case "class":
            passesFilter = p.groupId?.startsWith(
              activeFilter.value.replace("BE-", "").replace("TE-", ""),
            );
            break;
          case "category":
            passesFilter = p.category === activeFilter.value;
            break;
          case "application":
            passesFilter = p.projectApplication === activeFilter.value;
            break;
          case "techFocus":
            const titleLower = p.title?.toLowerCase() || "";
            let matchedCategory = "Platforms & Web Apps";
            for (const [cat, keywords] of Object.entries(keywordCategories)) {
              if (keywords.some((kw) => titleLower.includes(kw))) {
                matchedCategory = cat;
                break;
              }
            }
            passesFilter = matchedCategory === activeFilter.value;
            break;
        }
      }

      // 2. Check Search Bar
      let passesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        passesSearch =
          p.title?.toLowerCase().includes(q) ||
          p.guide?.toLowerCase().includes(q) ||
          p.groupId?.toLowerCase().includes(q) ||
          p.students?.some((s: any) => s.name.toLowerCase().includes(q));
      }

      return passesFilter && passesSearch;
    };

    const be = activeTab === "rbl" ? [] : beProjects.filter(isMatch);
    const rbl = activeTab === "be" ? [] : rblGroups.filter(isMatch);

    return {
      filteredBE: be,
      filteredRBL: rbl,
      displayProjects: [...be, ...rbl],
    };
  }, [activeFilter, searchQuery, activeTab]);

  // Computed metrics (using filtered data for true cross-filtering)
  const metrics = useMemo(() => {
    const totalBE = filteredBE.length;
    const totalRBL = filteredRBL.length;
    const totalProjects = totalBE + totalRBL;
    const beStudents = filteredBE.reduce(
      (a, p) => a + (p.students?.length || 0),
      0,
    );
    const rblStudents = filteredRBL.reduce(
      (a, p) => a + (p.students?.length || 0),
      0,
    );
    const totalStudents = beStudents + rblStudents;

    const allGuides = new Set([
      ...filteredBE.map((p) => p.guide),
      ...filteredRBL.map((p) => p.guide),
    ]);
    const totalGuides = allGuides.size;

    const domainCounts: Record<string, number> = {};
    filteredBE.forEach((p) => {
      if (p.domain) domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
    });
    const domainData = Object.entries(domainCounts)
      .map(([name, value]) => ({
        name: name.length > 25 ? name.slice(0, 25) + "…" : name,
        fullName: name,
        value,
      }))
      .sort((a, b) => b.value - a.value);

    const sdgCounts: Record<
      string,
      { sdg: number; title: string; count: number }
    > = {};
    filteredBE.forEach((p) => {
      if (p.sdg) {
        const key = String(p.sdg);
        if (!sdgCounts[key])
          sdgCounts[key] = { sdg: p.sdg, title: p.sdgTitle, count: 0 };
        sdgCounts[key].count++;
      }
    });
    const sdgData = Object.values(sdgCounts).sort((a, b) => b.count - a.count);

    // Tech Focus Areas
    const keywordCategories: Record<string, string[]> = {
      "AI & Machine Learning": [
        "ai",
        "ml",
        "machine learning",
        "deep learning",
        "nlp",
        "computer vision",
        "predictive",
        "intelligent",
        "genai",
      ],
      "IoT & Smart Systems": [
        "iot",
        "smart",
        "drone",
        "embedded",
        "microcontroller",
        "stm32",
        "esp8266",
        "hardware",
        "sensor",
      ],
      "Security & Crypto": [
        "blockchain",
        "cyber",
        "security",
        "fuzzer",
        "crypto",
        "secure",
        "fraud",
        "forgery",
        "threat",
      ],
      "Data & Analytics": [
        "data",
        "analytics",
        "tracker",
        "tracking",
        "analyzer",
        "monitoring",
        "detection",
      ],
      "Platforms & Web Apps": [
        "app",
        "platform",
        "web",
        "portal",
        "dashboard",
        "system",
        "management",
      ],
    };

    const techFocusCounts: Record<string, number> = Object.keys(
      keywordCategories,
    ).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    const allProjects = [...filteredBE, ...filteredRBL];

    allProjects.forEach((p) => {
      const titleLower = p.title?.toLowerCase() || "";
      let matched = false;
      Object.entries(keywordCategories).forEach(([category, keywords]) => {
        if (keywords.some((kw) => titleLower.includes(kw))) {
          techFocusCounts[category]++;
          matched = true;
        }
      });
      if (!matched) {
        techFocusCounts["Platforms & Web Apps"]++; // Default fallback
      }
    });

    const techFocusData = Object.entries(techFocusCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Class-wise
    const classData = [
      {
        name: "BE-A",
        value: filteredBE.filter((p) => p.groupId?.startsWith("A")).length,
      },
      {
        name: "BE-B",
        value: filteredBE.filter((p) => p.groupId?.startsWith("B")).length,
      },
      {
        name: "BE-C",
        value: filteredBE.filter((p) => p.groupId?.startsWith("C")).length,
      },
      {
        name: "TE-A",
        value: filteredRBL.filter((p) => p.groupId?.startsWith("A")).length,
      },
      {
        name: "TE-B",
        value: filteredRBL.filter((p) => p.groupId?.startsWith("B")).length,
      },
      {
        name: "TE-C",
        value: filteredRBL.filter((p) => p.groupId?.startsWith("C")).length,
      },
    ];

    // Categories & Applications
    const categoryCounts: Record<string, number> = {};
    const applicationCounts: Record<string, number> = {};

    filteredBE.forEach((p) => {
      if (p.category)
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      if (p.projectApplication)
        applicationCounts[p.projectApplication] =
          (applicationCounts[p.projectApplication] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    const applicationData = Object.entries(applicationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalProjects,
      totalBE,
      totalRBL,
      totalStudents,
      beStudents,
      rblStudents,
      totalGuides,
      domainData,
      sdgData,
      techFocusData,
      classData,
      categoryData,
      applicationData,
    };
  }, [filteredBE, filteredRBL]);

  const kpiCards = [
    {
      label: "Total Projects",
      value: metrics.totalProjects,
      sub:
        activeTab === "overview"
          ? `${metrics.totalBE} Major + ${metrics.totalRBL} RBL`
          : activeTab === "be"
            ? "BE Major Projects"
            : "TE RBL Projects",
      icon: FolderKanban,
      color: "from-indigo-500 to-purple-600",
      change: "Active",
      up: true,
    },
    {
      label: "Total Students",
      value: metrics.totalStudents,
      sub:
        activeTab === "overview"
          ? `${metrics.beStudents} BE + ${metrics.rblStudents} TE`
          : "Enrolled students",
      icon: Users,
      color: "from-cyan-500 to-blue-600",
      change: `Avg ${(metrics.totalStudents / Math.max(1, metrics.totalProjects)).toFixed(1)}/proj`,
      up: true,
    },
    {
      label: "Faculty Guides",
      value: metrics.totalGuides,
      sub: "Assisting active projects",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-600",
      change: "Mentorship",
      up: true,
    },
    {
      label: activeTab === "rbl" ? "Tech Focus Areas" : "Unique Domains",
      value:
        activeTab === "rbl"
          ? metrics.techFocusData.length
          : metrics.domainData.length,
      sub: activeTab === "rbl" ? "Identified from titles" : "BE Major Projects",
      icon: Lightbulb,
      color: "from-amber-500 to-orange-600",
      change:
        activeTab === "rbl"
          ? "Innovation focus"
          : `${metrics.sdgData.length} SDGs`,
      up: true,
    },
  ];

  const CustomTooltipStyle =
    "bg-neutral-900/95 dark:bg-neutral-800/95 backdrop-blur-xl border border-neutral-700 rounded-xl px-4 py-3 shadow-2xl text-white text-xs max-w-[220px] whitespace-normal";

  return (
    <div className="relative w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 dark:bg-indigo-900/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-cyan-200/20 dark:bg-cyan-900/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-200/10 dark:bg-emerald-900/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-24 pointer-events-none">
        <div className="relative w-full max-w-7xl mx-auto h-full px-6">
          <div className="pointer-events-auto">
            <FloatingPillNavbar />
          </div>
        </div>
      </div>

      <ThemeToggle />

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 pb-12 pt-32 space-y-8 text-neutral-800 dark:text-neutral-100">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-black rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 backdrop-blur-xl">
              <Image
                src="/tcetlogo.png"
                alt="TCET Logo"
                width={40}
                height={40}
                unoptimized
                className="object-contain w-8 h-8 md:w-10 md:h-10"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
                Project Analytics
              </h1>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl text-base md:text-lg leading-relaxed">
            Comprehensive dashboard visualizing data across Major Projects (BE)
            and RBL Projects (TE) — students, domains, SDG alignment, and
            faculty distribution.
          </p>

          {/* Tabs & Search Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {(["overview", "be", "rbl"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === tab ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-lg" : "bg-white/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"}`}
                >
                  {tab === "overview"
                    ? "Overview"
                    : tab === "be"
                      ? "Major Projects"
                      : "RBL Projects"}
                </button>
              ))}
            </div>

            {/* Search & Active Filter Controls */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              {activeFilter && (
                <button
                  onClick={() => setActiveFilter(null)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors whitespace-nowrap"
                >
                  {activeFilter.value} <X className="w-3 h-3" />
                </button>
              )}

              <div className="relative w-full md:w-64 lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search projects, guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {kpiCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-5 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                    {card.label}
                  </p>
                  <p className="text-3xl font-black text-neutral-900 dark:text-white">
                    {card.value}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">
                    {card.sub}
                  </p>
                </div>
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}
                >
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3" /> {card.change}
                </span>
              </div>
              <div
                className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${card.color} rounded-full opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row 1: Domain Donut + SDG Distribution */}
        {activeTab !== "rbl" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Domain Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Domain Distribution
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    BE Major Projects by Domain
                  </p>
                </div>
                <Target className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer
                  width="100%"
                  height={220}
                  className="sm:w-1/2"
                >
                  <PieChart>
                    <Pie
                      data={metrics.domainData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      onClick={(data) =>
                        handleChartClick("domain", data.fullName)
                      }
                      className="cursor-pointer transition-opacity duration-300 hover:opacity-80"
                    >
                      {metrics.domainData.map((d, i) => (
                        <Cell
                          key={i}
                          fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                          opacity={
                            activeFilter &&
                            activeFilter.type === "domain" &&
                            activeFilter.value !== d.fullName
                              ? 0.3
                              : 1
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className={CustomTooltipStyle}>
                            <p className="font-bold text-white mb-1">
                              {d.name}
                            </p>
                            <p className="text-indigo-400 font-bold">
                              {d.value} Projects
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-full sm:w-1/2 space-y-2.5">
                  {metrics.domainData.map((d, i) => (
                    <div key={d.fullName} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            DONUT_COLORS[i % DONUT_COLORS.length],
                        }}
                      />
                      <span
                        className="text-xs text-neutral-600 dark:text-neutral-400 truncate flex-1"
                        title={d.fullName}
                      >
                        {d.name}
                      </span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* SDG Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    SDG Alignment
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    UN Sustainable Development Goals Coverage
                  </p>
                </div>
                <Award className="w-5 h-5 text-emerald-500" />
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={metrics.sdgData} barSize={20}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(128,128,128,0.15)"
                  />
                  <XAxis
                    dataKey="sdg"
                    tick={{ fontSize: 11, fill: "#888" }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "SDG #",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 10,
                      fill: "#999",
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#888" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className={CustomTooltipStyle}>
                          <p className="font-bold text-white">SDG {d.sdg}</p>
                          <p className="text-neutral-400">{d.title}</p>
                          <p className="mt-1 text-emerald-400 font-bold">
                            {d.count} project{d.count > 1 ? "s" : ""}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    onClick={(data) =>
                      handleChartClick("sdg", String(data.sdg))
                    }
                    className="cursor-pointer"
                  >
                    {metrics.sdgData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                        opacity={
                          activeFilter &&
                          activeFilter.type === "sdg" &&
                          activeFilter.value !== String(d.sdg)
                            ? 0.3
                            : 1
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Charts Row 2: Team Size + Class Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tech Focus Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Innovation Focus Areas
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Key technologies driving student projects
                </p>
              </div>
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={metrics.techFocusData}
                layout="vertical"
                barSize={18}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(128,128,128,0.15)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#888" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={115}
                  tick={{ fontSize: 11, fill: "#888" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(128,128,128,0.05)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className={CustomTooltipStyle}>
                        <p className="font-bold">{d.name}</p>
                        <p className="mt-1 text-amber-400 font-bold">
                          {d.count} project{d.count > 1 ? "s" : ""}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 6, 6, 0]}
                  onClick={(data) => handleChartClick("techFocus", data.name)}
                  className="cursor-pointer"
                >
                  {metrics.techFocusData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                      opacity={
                        activeFilter &&
                        activeFilter.type === "techFocus" &&
                        activeFilter.value !== d.name
                          ? 0.3
                          : 1
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Class-wise Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm"
          >
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              Class Breakdown
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Projects per class division
            </p>
            <div className="space-y-4">
              {metrics.classData.map((item, i) => {
                const maxVal = Math.max(
                  ...metrics.classData.map((c) => c.value),
                  1,
                );
                const pct = (item.value / maxVal) * 100;
                const color = i < 3 ? DONUT_COLORS[i] : AREA_GRADIENT[i - 3];
                const isFaded =
                  activeFilter &&
                  activeFilter.type === "class" &&
                  activeFilter.value !== item.name;

                return (
                  <div
                    key={item.name}
                    className={`space-y-1.5 cursor-pointer transition-opacity duration-300 ${isFaded ? "opacity-30" : "hover:opacity-80"}`}
                    onClick={() => handleChartClick("class", item.name)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        {item.name}
                      </span>
                      <span className="text-sm font-black text-neutral-900 dark:text-white">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          delay: 0.7 + i * 0.1,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Charts Row 3: Categories + Applications */}
        {activeTab !== "rbl" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Category Donut */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Project Categories
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Classification of BE Projects
                  </p>
                </div>
                <Layers className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer
                  width="100%"
                  height={220}
                  className="sm:w-1/2"
                >
                  <PieChart>
                    <Pie
                      data={metrics.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="count"
                      stroke="none"
                      onClick={(data) =>
                        handleChartClick("category", data.name)
                      }
                      className="cursor-pointer transition-opacity duration-300 hover:opacity-80"
                    >
                      {metrics.categoryData.map((d, i) => (
                        <Cell
                          key={i}
                          fill={AREA_GRADIENT[i % AREA_GRADIENT.length]}
                          opacity={
                            activeFilter &&
                            activeFilter.type === "category" &&
                            activeFilter.value !== d.name
                              ? 0.3
                              : 1
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className={CustomTooltipStyle}>
                            <p className="font-bold text-white mb-1">
                              {d.name}
                            </p>
                            <p className="text-indigo-400 font-bold">
                              {d.count} Projects
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-full sm:w-1/2 space-y-2.5">
                  {metrics.categoryData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            AREA_GRADIENT[i % AREA_GRADIENT.length],
                        }}
                      />
                      <span
                        className="text-xs text-neutral-600 dark:text-neutral-400 truncate flex-1"
                        title={d.name}
                      >
                        {d.name}
                      </span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {d.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Application Focus BarChart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Application Focus
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Target End-Users / Audience
                  </p>
                </div>
                <Briefcase className="w-5 h-5 text-amber-500" />
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={metrics.applicationData} barSize={25}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(128,128,128,0.15)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#888" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#888" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(128,128,128,0.05)" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className={CustomTooltipStyle}>
                          <p className="font-bold">{d.name}</p>
                          <p className="mt-1 text-amber-400 font-bold">
                            {d.count} project{d.count > 1 ? "s" : ""}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    onClick={(data) =>
                      handleChartClick("application", data.name)
                    }
                    className="cursor-pointer"
                  >
                    {metrics.applicationData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                        opacity={
                          activeFilter &&
                          activeFilter.type === "application" &&
                          activeFilter.value !== d.name
                            ? 0.3
                            : 1
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Filtered & Searched Results Section */}
        {(activeFilter || searchQuery) && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  {activeFilter ? (
                    <>
                      Projects for:{" "}
                      <span className="text-indigo-500">
                        {activeFilter.value}
                      </span>
                    </>
                  ) : (
                    <>
                      Search Results for:{" "}
                      <span className="text-indigo-500">"{searchQuery}"</span>
                    </>
                  )}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Found {displayProjects.length} matching project
                  {displayProjects.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveFilter(null);
                  setSearchQuery("");
                }}
                className="px-4 py-2 text-sm font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Clear Results
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 hover:bg-white dark:hover:bg-neutral-900 transition-colors flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                      Group {proj.groupId}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-2 mb-3">
                    {proj.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span className="truncate">{proj.guide}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
