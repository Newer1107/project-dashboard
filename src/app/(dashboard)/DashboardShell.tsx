"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { useUIStore } from "@/store/ui.store";

interface DashboardShellProps {
  userId: string;
  userName: string;
  userRole: "ADMIN" | "TEACHER" | "STUDENT";
  userImage?: string | null;
  children: React.ReactNode;
}

export function DashboardShell({
  userId,
  userName,
  userRole,
  userImage,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="dashboard-surface min-h-screen bg-background">
      <Sidebar role={userRole} userName={userName} />
      <Topbar userId={userId} userName={userName} userRole={userRole} userImage={userImage} />
      <NotificationPanel userId={userId} />

      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="pt-16 min-h-screen"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-4 md:p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
