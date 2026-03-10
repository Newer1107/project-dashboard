"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUIStore } from "@/store/ui.store";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";

const typeIcons: Record<string, { color: string; bg: string }> = {
  TASK_ASSIGNED: { color: "text-indigo-400", bg: "bg-indigo-500/10" },
  DEADLINE_APPROACHING: { color: "text-amber-400", bg: "bg-amber-500/10" },
  REVIEW_SCHEDULED: { color: "text-violet-400", bg: "bg-violet-500/10" },
  FEEDBACK_GIVEN: { color: "text-emerald-400", bg: "bg-emerald-500/10" },
  PROJECT_UPDATED: { color: "text-blue-400", bg: "bg-blue-500/10" },
  MILESTONE_DUE: { color: "text-rose-400", bg: "bg-rose-500/10" },
};

interface NotificationPanelProps {
  userId: string;
}

export function NotificationPanel({ userId }: NotificationPanelProps) {
  const { notificationPanelOpen, setNotificationPanelOpen } = useUIStore();
  const { data: notifications = [] } = useNotifications(userId);
  const queryClient = useQueryClient();

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  async function markRead(notificationId: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId }),
    });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <AnimatePresence>
      {notificationPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setNotificationPanelOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-screen w-96 border-l bg-card shadow-xl"
          >
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={markAllRead}>
                  <CheckCheck className="mr-1 h-4 w-4" />
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationPanelOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-73px)]">
              <div className="space-y-1 p-2">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 mb-4 opacity-30" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification: any) => {
                    const style = typeIcons[notification.type] ?? typeIcons.PROJECT_UPDATED;
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 rounded-lg p-3 transition-colors cursor-pointer ${
                          notification.isRead
                            ? "opacity-60"
                            : "bg-accent/50 hover:bg-accent"
                        }`}
                        onClick={() => {
                          if (!notification.isRead) markRead(notification.id);
                          if (notification.link) {
                            setNotificationPanelOpen(false);
                            window.location.href = notification.link;
                          }
                        }}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.bg}`}
                        >
                          <Bell className={`h-4 w-4 ${style.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
