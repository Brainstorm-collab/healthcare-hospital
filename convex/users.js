import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all users by role
export const getUsersByRole = query({
  args: {
    role: v.union(v.literal("patient"), v.literal("doctor")),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();

    // Remove passwords from response
    return users.map(({ password: _, ...user }) => user);
  },
});

// Get user by ID
export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    specialization: v.optional(v.string()),
    experience: v.optional(v.string()),
    consultationFee: v.optional(v.number()),
    clinic: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    const existingUser = await ctx.db.get(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Update doctor availability
export const updateAvailability = mutation({
  args: {
    doctorId: v.id("users"),
    isAvailable: v.boolean(),
    availableSlots: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const doctor = await ctx.db.get(args.doctorId);
    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Doctor not found");
    }

    await ctx.db.patch(args.doctorId, {
      isAvailable: args.isAvailable,
      availableSlots: args.availableSlots,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

