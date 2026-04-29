"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, Search, Moon, Sun, Command as CommandIcon, User, LogOut, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useUIStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUnreadCount } from "@/hooks/useNotifications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface TopbarProps {
  userId: string;
  userName: string;
  userRole: "ADMIN" | "TEACHER" | "STUDENT";
  userImage?: string | null;
}

export function Topbar({ userId, userName, userRole, userImage }: TopbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { sidebarCollapsed, setNotificationPanelOpen } = useUIStore();
  const { data: unreadData } = useUnreadCount(userId);
  const unreadCount = unreadData?.count ?? 0;
  const [commandOpen, setCommandOpen] = React.useState(false);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleHome =
    userRole === "ADMIN" ? "/admin" : userRole === "TEACHER" ? "/teacher" : "/student";

  const navCommands =
    userRole === "ADMIN"
      ? [
          { label: "Admin Overview", href: "/admin" },
          { label: "Manage Users", href: "/admin/users" },
          { label: "Showcase Reviews", href: "/admin/showcase" },
          { label: "Admin Settings", href: "/admin/settings" },
        ]
      : userRole === "TEACHER"
      ? [
          { label: "Teacher Dashboard", href: "/teacher" },
          { label: "Teacher Projects", href: "/teacher/projects" },
          { label: "Teacher Analytics", href: "/teacher/analytics" },
          { label: "Create New Project", href: "/teacher/projects/new" },
          { label: "My Showcase Projects", href: "/showcase/my-projects" },
        ]
      : [
          { label: "Student Dashboard", href: "/student" },
          { label: "My Projects", href: "/student/projects" },
          { label: "My Notifications", href: "/student/notifications" },
          { label: "My Showcase Projects", href: "/showcase/my-projects" },
        ];

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const modifier = isMac ? event.metaKey : event.ctrlKey;
      if (modifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (modifier && event.key.toLowerCase() === "b") {
        event.preventDefault();
        setNotificationPanelOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setNotificationPanelOpen]);

  function navigateTo(href: string) {
    setCommandOpen(false);
    router.push(href);
  }

  function handleSignOut() {
    const callbackUrl = encodeURIComponent(window.location.origin);
    window.location.href = `https://tcetcercd.in/logout?callbackUrl=${callbackUrl}`;
  }

  return (
    <>
      <motion.header
        animate={{ paddingLeft: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 md:px-6"
        style={{ backdropFilter: "blur(12px)", backgroundColor: "hsl(var(--background) / 0.8)" }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            className="h-9 w-[190px] justify-start gap-2 border-dashed bg-background/70 text-muted-foreground hover:text-foreground md:w-[300px]"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="truncate">Search, jump, run actions...</span>
            <span className="ml-auto hidden items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] md:inline-flex">
              <CommandIcon className="h-3 w-3" />
              K
            </span>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
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

      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="max-w-xl overflow-hidden p-0">
          <DialogTitle className="sr-only">Command Menu</DialogTitle>
          <DialogDescription className="sr-only">
            Search and run quick dashboard actions.
          </DialogDescription>
          <Command className="rounded-lg border-none bg-transparent">
            <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <Command.Input
                placeholder="Type a command or search route..."
                className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Command.List className="max-h-[340px] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-10 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <Command.Group heading="Navigation" className="px-1 text-xs text-muted-foreground">
                {navCommands.map((item) => (
                  <Command.Item
                    key={item.href}
                    onSelect={() => navigateTo(item.href)}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-accent"
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Separator className="my-2 h-px bg-border" />

              <Command.Group heading="Quick Actions" className="px-1 text-xs text-muted-foreground">
                <Command.Item
                  onSelect={() => {
                    setCommandOpen(false);
                    setNotificationPanelOpen(true);
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-accent"
                >
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  Open Notifications
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                    setCommandOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-accent"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  )}
                  Toggle Theme
                </Command.Item>
                <Command.Item
                  onSelect={() => navigateTo(roleHome)}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-accent"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Go To Home
                </Command.Item>
                <Command.Item
                  onSelect={() => navigateTo(userRole === "ADMIN" ? "/admin/settings" : roleHome)}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-accent"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  {userRole === "ADMIN" ? "Open Settings" : "Open Dashboard"}
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    setCommandOpen(false);
                    handleSignOut();
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive data-[selected=true]:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
