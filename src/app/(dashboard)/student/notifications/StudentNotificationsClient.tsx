"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  CalendarClock,
  FileText,
  ListChecks,
  Check,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeIcons: Record<string, React.ReactNode> = {
  TASK_ASSIGNED: <ListChecks className="h-4 w-4 text-indigo-400" />,
  TASK_UPDATED: <ListChecks className="h-4 w-4 text-blue-400" />,
  REVIEW_SCHEDULED: <CalendarClock className="h-4 w-4 text-amber-400" />,
  REVIEW_COMPLETED: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  FEEDBACK_RECEIVED: <MessageSquare className="h-4 w-4 text-violet-400" />,
  FILE_UPLOADED: <FileText className="h-4 w-4 text-blue-400" />,
  DEADLINE_REMINDER: <AlertCircle className="h-4 w-4 text-rose-400" />,
  GENERAL: <Bell className="h-4 w-4 text-zinc-400" />,
};

const filterOptions = ["ALL", "TASK_ASSIGNED", "REVIEW_SCHEDULED", "FEEDBACK_RECEIVED", "DEADLINE_REMINDER"];

type StudentNotificationsClientProps = {
  userId: string;
};

export default function StudentNotificationsClient({ userId }: StudentNotificationsClientProps) {
  const { data, isLoading, markRead, markAllRead } = useNotifications(userId);
  const [filter, setFilter] = useState("ALL");

  const notifications = data ?? [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;
  const unreadLabel = unreadCount > 99 ? "99+" : String(unreadCount);
  const filtered =
    filter === "ALL"
      ? notifications
      : notifications.filter((n: any) => n.type === filter);

  const grouped = groupedByDate(filtered);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm">
            Stay updated on project activity
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllRead()} className="relative">
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
            <span className="absolute -top-1 -right-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-semibold text-black">
              {unreadLabel}
            </span>
          </Button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((f) => (
          <Badge
            key={f}
            variant={filter === f ? "default" : "outline"}
            className="cursor-pointer transition-colors"
            onClick={() => setFilter(f)}
          >
            {f.replace(/_/g, " ")}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground">No notifications</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-sm font-semibold text-muted-foreground mb-3">{date}</p>
              <div className="space-y-2">
                <AnimatePresence>
                  {(items as any[]).map((n: any) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                        n.isRead ? "bg-card" : "bg-primary/5 border-primary/20"
                      }`}
                    >
                      <div className="mt-0.5">
                        {typeIcons[n.type] ?? typeIcons.GENERAL}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{n.title}</p>
                        {n.message && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0"
                          onClick={() => markRead(n.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function groupedByDate(items: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  for (const item of items) {
    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  }
  return groups;
}
