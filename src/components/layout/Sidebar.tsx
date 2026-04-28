"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  GraduationCap,
  Bell,
  Mail,
  Upload,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNav: NavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Projects", href: "/admin/projects", icon: FolderKanban },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Teacher Approvals", href: "/admin/teacher-approvals", icon: UserCheck },
  { title: "Project Assignments", href: "/admin/project-assignments", icon: Upload },
  { title: "Email Logs", href: "/admin/email-logs", icon: Mail },
  { title: "Showcase", href: "/admin/showcase", icon: Sparkles },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const teacherNav: NavItem[] = [
  { title: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { title: "Projects", href: "/teacher/projects", icon: FolderKanban },
  { title: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
  { title: "Showcase", href: "/showcase/my-projects", icon: Sparkles },
];

const studentNav: NavItem[] = [
  { title: "Dashboard", href: "/student", icon: LayoutDashboard },
  { title: "My Projects", href: "/student/projects", icon: FolderKanban },
  { title: "Notifications", href: "/student/notifications", icon: Bell },
  { title: "Showcase", href: "/showcase/my-projects", icon: Sparkles },
];

interface SidebarProps {
  role: "ADMIN" | "TEACHER" | "STUDENT";
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const navItems =
    role === "ADMIN" ? adminNav : role === "TEACHER" ? teacherNav : studentNav;

  const roleLabel =
    role === "ADMIN" ? "Administrator" : role === "TEACHER" ? "Teacher" : "Student";

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-sm">Project Dashboard</span>
              </motion.div>
            )}
          </AnimatePresence>
          {sidebarCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 mx-auto">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `/${role.toLowerCase()}` &&
                pathname.startsWith(item.href));

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  sidebarCollapsed && "justify-center px-2"
                )}
              >
                <item.icon
                  className={cn("h-5 w-5 shrink-0", isActive && "text-primary")}
                />
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );

            return (
              <div key={item.href} className="relative">
                {sidebarCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                ) : (
                  linkContent
                )}
              </div>
            );
          })}
        </nav>

        <Separator />

        {/* Footer */}
        <div className="p-2 space-y-1">
          {!sidebarCollapsed && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={sidebarCollapsed ? "icon" : "default"}
                className={cn("w-full", !sidebarCollapsed && "justify-start")}
                onClick={() => {
                  const callbackUrl = encodeURIComponent(window.location.origin);
                  window.location.href = `https://tcetcercd.in/logout?callbackUrl=${callbackUrl}`;
                }}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span className="ml-3">Sign Out</span>}
              </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right">Sign Out</TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border bg-background shadow-sm"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </motion.aside>
    </TooltipProvider>
  );
}
