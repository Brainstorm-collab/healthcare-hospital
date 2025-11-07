import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Create a notification
export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("appointment_created"),
      v.literal("appointment_confirmed"),
      v.literal("appointment_cancelled"),
      v.literal("appointment_completed"),
      v.literal("appointment_reminder"),
      v.literal("prescription_added"),
      v.literal("medical_record_added"),
      v.literal("system")
    ),
    title: v.string(),
    message: v.string(),
    appointmentId: v.optional(v.id("appointments")),
    medicalRecordId: v.optional(v.id("medicalRecords")),
    actionUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      read: false,
      appointmentId: args.appointmentId,
      medicalRecordId: args.medicalRecordId,
      actionUrl: args.actionUrl,
      createdAt: Date.now(),
    });

    return { notificationId, success: true };
  },
});

// Get all notifications for a user
export const getNotificationsByUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_created", (q) => q.eq("userId", args.userId))
      .collect();

    // Sort by createdAt (newest first)
    notifications.sort((a, b) => b.createdAt - a.createdAt);

    // Apply limit if provided
    if (args.limit) {
      notifications = notifications.slice(0, args.limit);
    }

    return notifications;
  },
});

// Get unread notifications count
export const getUnreadCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) => q.eq("userId", args.userId).eq("read", false))
      .collect();

    return notifications.length;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    await ctx.db.patch(args.notificationId, {
      read: true,
      readAt: Date.now(),
    });

    return { success: true };
  },
});

// Mark all notifications as read for a user
export const markAllAsRead = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) => q.eq("userId", args.userId).eq("read", false))
      .collect();

    const now = Date.now();
    await Promise.all(
      notifications.map((notification) =>
        ctx.db.patch(notification._id, {
          read: true,
          readAt: now,
        })
      )
    );

    return { success: true, count: notifications.length };
  },
});

// Delete a notification
export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    await ctx.db.delete(args.notificationId);
    return { success: true };
  },
});

