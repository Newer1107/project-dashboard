import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  return prisma.notification.create({ data });
}

export async function createBulkNotifications(
  userIds: string[],
  data: {
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
  }
) {
  return prisma.notification.createMany({
    data: userIds.map((userId) => ({ userId, ...data })),
  });
}

export async function markNotificationRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}
