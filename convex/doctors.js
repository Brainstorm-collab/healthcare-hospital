import { v } from "convex/values";
import { query } from "./_generated/server";

const matchesFilters = (doctor, { specialization, location, search }) => {
  if (doctor.role !== "doctor") return false;

  if (specialization && doctor.specialization !== specialization) {
    return false;
  }

  if (location) {
    const locationLower = location.toLowerCase();
    if (!(doctor.location || "").toLowerCase().includes(locationLower)) {
      return false;
    }
  }

  if (search) {
    const searchLower = search.toLowerCase();
    const haystack = `${doctor.name || ""} ${doctor.specialization || ""} ${doctor.clinic || ""}`.toLowerCase();
    if (!haystack.includes(searchLower)) {
      return false;
    }
  }

  return true;
};

// Get doctors with server-side pagination and filtering
export const listDoctors = query({
  args: {
    specialization: v.optional(v.string()),
    location: v.optional(v.string()),
    search: v.optional(v.string()),
    paginationOpts: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { specialization, location, search, paginationOpts } = args;
    const pagOpts = paginationOpts ?? {};

    let baseQuery;
    if (specialization) {
      baseQuery = ctx.db
        .query("users")
        .withIndex("by_specialization", (q) => q.eq("specialization", specialization));
    } else {
      baseQuery = ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", "doctor"));
    }

    const requestedItems = pagOpts.numItems ?? 12;
    const batchSize = Math.max(requestedItems * 2, 16);

    const page = await baseQuery.paginate({
      ...pagOpts,
      numItems: batchSize,
    });

    const filtered = page.page.filter((doctor) =>
      matchesFilters(doctor, { specialization, location, search })
    );

    const sanitized = filtered.map(({ password: _, ...doctor }) => doctor);

    const hasMoreMatches = !page.isDone;

    const slimPage = sanitized.map((doctor) => ({
      _id: doctor._id,
      name: doctor.name,
      specialization: doctor.specialization ?? "",
      experience: doctor.experience ?? "",
      location: doctor.location ?? "",
      clinic: doctor.clinic ?? "",
      consultationFee: doctor.consultationFee ?? null,
      rating: doctor.rating ?? null,
      patientStories: doctor.patientStories ?? null,
      profileImage: doctor.profileImage ?? "",
      isAvailable: doctor.isAvailable !== false,
    }));

    return {
      page: slimPage,
      isDone: hasMoreMatches ? false : page.isDone,
      continueCursor: page.isDone ? undefined : page.continueCursor,
    };
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

