"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchNotifications(userId: string) {
  const res = await fetch(`/api/notifications?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

async function fetchUnreadCount(userId: string) {
  const res = await fetch(`/api/notifications/count?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch count");
  return res.json();
}

export function useNotifications(userId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotifications(userId),
    enabled: !!userId,
    refetchInterval: 30000,
  });

  async function markRead(notificationId: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId }),
    });
    queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    queryClient.invalidateQueries({ queryKey: ["notifications", "count", userId] });
  }

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    queryClient.invalidateQueries({ queryKey: ["notifications", "count", userId] });
  }

  return { ...query, markRead, markAllRead };
}

export function useUnreadCount(userId: string) {
  return useQuery({
    queryKey: ["notifications", "count", userId],
    queryFn: () => fetchUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 30000,
  });
}
