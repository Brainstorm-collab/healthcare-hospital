import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all departments
export const listDepartments = query({
  handler: async (ctx) => {
    const departments = await ctx.db.query("departments").collect();
    return departments;
  },
});

// Get department by ID
export const getDepartmentById = query({
  args: {
    departmentId: v.id("departments"),
  },
  handler: async (ctx, args) => {
    const department = await ctx.db.get(args.departmentId);
    return department;
  },
});

// Create department
export const createDepartment = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const departmentId = await ctx.db.insert("departments", {
      name: args.name,
      description: args.description,
      icon: args.icon,
      doctorIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { departmentId, success: true };
  },
});

// Update department
export const updateDepartment = mutation({
  args: {
    departmentId: v.id("departments"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    doctorIds: v.optional(v.array(v.id("users"))),
  },
  handler: async (ctx, args) => {
    const { departmentId, ...updates } = args;
    const department = await ctx.db.get(departmentId);
    if (!department) {
      throw new Error("Department not found");
    }

    await ctx.db.patch(departmentId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

