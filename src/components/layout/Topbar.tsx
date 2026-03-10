"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useUIStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUnreadCount } from "@/hooks/useNotifications";

interface TopbarProps {
  userId: string;
  userName: string;
  userImage?: string | null;
}

export function Topbar({ userId, userName, userImage }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { sidebarCollapsed, setNotificationPanelOpen } = useUIStore();
  const { data: unreadData } = useUnreadCount(userId);
  const unreadCount = unreadData?.count ?? 0;

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.header
      animate={{ paddingLeft: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6"
      style={{ backdropFilter: "blur(12px)", backgroundColor: "hsl(var(--background) / 0.8)" }}
    >
      <div className="flex items-center gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, tasks..."
            className="w-64 pl-9 bg-secondary/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setNotificationPanelOpen(true)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        <Avatar className="h-8 w-8">
          {userImage && <AvatarImage src={userImage} alt={userName} />}
          <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </motion.header>
  );
}
