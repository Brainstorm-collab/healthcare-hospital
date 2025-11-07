import { v } from "convex/values";
import { query } from "./_generated/server";

// Get all doctors
export const listDoctors = query({
  args: {
    specialization: v.optional(v.string()),
    location: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let doctorsQuery = ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "doctor"));

    const doctors = await doctorsQuery.collect();

    // Filter by specialization if provided
    let filtered = doctors;
    if (args.specialization) {
      filtered = filtered.filter((d) => d.specialization === args.specialization);
    }

    // Filter by location if provided
    if (args.location) {
      filtered = filtered.filter((d) =>
        d.location?.toLowerCase().includes(args.location.toLowerCase())
      );
    }

    // Search by name or specialization
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(searchLower) ||
          d.specialization?.toLowerCase().includes(searchLower) ||
          d.clinic?.toLowerCase().includes(searchLower)
      );
    }

    // Remove passwords from response
    return filtered.map(({ password: _, ...doctor }) => doctor);
  },
});

// Get doctor by ID
export const getDoctorById = query({
  args: {
    doctorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const doctor = await ctx.db.get(args.doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return null;
    }
    const { password: _, ...doctorWithoutPassword } = doctor;
    return doctorWithoutPassword;
  },
});

// Get doctors by specialization
export const getDoctorsBySpecialization = query({
  args: {
    specialization: v.string(),
  },
  handler: async (ctx, args) => {
    const doctors = await ctx.db
      .query("users")
      .withIndex("by_specialization", (q) => q.eq("specialization", args.specialization))
      .collect();

    return doctors
      .filter((d) => d.role === "doctor")
      .map(({ password: _, ...doctor }) => doctor);
  },
});

