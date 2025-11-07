import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Note: bcryptjs needs to be installed in Convex
// For now, we'll use a simple hash. In production, use proper password hashing
async function hashPassword(password) {
  // Using Web Crypto API which is available in Convex
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function comparePassword(password, hash) {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}

// Register a new user
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()), // Optional for social logins
    role: v.union(v.literal("patient"), v.literal("doctor")),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    specialization: v.optional(v.string()),
    experience: v.optional(v.string()),
    consultationFee: v.optional(v.number()),
    clinic: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password if provided
    const hashedPassword = args.password ? await hashPassword(args.password) : undefined;

    // Create user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: hashedPassword,
      role: args.role,
      phone: args.phone,
      address: args.address,
      specialization: args.specialization,
      experience: args.experience,
      consultationFee: args.consultationFee,
      clinic: args.clinic,
      location: args.location,
      isAvailable: args.role === "doctor" ? true : undefined,
      availableSlots: args.role === "doctor" ? [] : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { userId, success: true };
  },
});

// Login user
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await comparePassword(args.password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Update last login time (optional)
    await ctx.db.patch(user._id, {
      updatedAt: Date.now(),
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

// Social login (Google, Apple, etc.)
export const socialLogin = mutation({
  args: {
    provider: v.string(), // 'google', 'apple', etc.
    providerId: v.string(), // Social provider's user ID (e.g., Google sub)
    email: v.string(),
    name: v.string(),
    picture: v.optional(v.string()), // Profile picture URL
    role: v.optional(v.union(v.literal("patient"), v.literal("doctor"))),
  },
  handler: async (ctx, args) => {
    // Check if user already exists by email or providerId
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    // If user exists, update provider info if needed
    if (user) {
      // Update provider info if not set
      if (!user.provider || !user.providerId) {
        await ctx.db.patch(user._id, {
          provider: args.provider,
          providerId: args.providerId,
          profileImage: args.picture || user.profileImage,
          updatedAt: Date.now(),
        });
        user = await ctx.db.get(user._id);
      }
    } else {
      // Create new user with social login
      const userId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        password: undefined, // No password for social logins
        role: args.role || "patient", // Default to patient if not specified
        provider: args.provider,
        providerId: args.providerId,
        profileImage: args.picture,
        isAvailable: args.role === "doctor" ? true : undefined,
        availableSlots: args.role === "doctor" ? [] : undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

// Get current user (for auth context)
export const getCurrentUser = query({
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

