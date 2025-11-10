import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { notificationToJSON } from "../utils/transformers";

export const getNotificationsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { userId, page: pageParam, limit: limitParam } = req.query as {
    userId?: string;
    page?: string;
    limit?: string;
  };

  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  const page = Math.max(parseInt(pageParam ?? "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(limitParam ?? "12", 10), 1), 100);
  const skip = (page - 1) * limit;

  const [total, notifications] = await Promise.all([
    prisma.notification.count({ where: { userId } }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return res.json({
    data: notifications.map(notificationToJSON),
    pagination: {
      page,
      limit,
      total,
      hasMore: page * limit < total,
    },
  });
});

export const getUnreadCountHandler = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };

  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  const count = await prisma.notification.count({
    where: { userId, read: false },
  });

  return res.json({ count });
});

export const markNotificationAsReadHandler = asyncHandler(async (req: Request, res: Response) => {
  const notificationId = req.params.id ?? req.body?.notificationId;

  if (!notificationId) {
    return res.status(400).json({ error: "notificationId is required." });
  }

  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      read: true,
      readAt: new Date(),
    },
  });

  return res.json({ success: true, notification: notificationToJSON(notification) });
});

export const markAllNotificationsAsReadHandler = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body ?? {};

  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  const now = new Date();

  const { count } = await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
      readAt: now,
    },
  });

  return res.json({ success: true, count });
});

export const deleteNotificationHandler = asyncHandler(async (req: Request, res: Response) => {
  const notificationId = req.params.id ?? req.body?.notificationId;

  if (!notificationId) {
    return res.status(400).json({ error: "notificationId is required." });
  }

  await prisma.notification.delete({ where: { id: notificationId } });

  return res.status(204).send();
});


