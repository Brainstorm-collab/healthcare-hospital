import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get medical records by patient ID
export const getRecordsByPatient = query({
  args: {
    patientId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("medicalRecords")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();

    // Sort by date (newest first)
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Populate doctor details
    const recordsWithDetails = await Promise.all(
      records.map(async (record) => {
        const doctor = await ctx.db.get(record.doctorId);
        return {
          ...record,
          doctor: doctor
            ? {
                name: doctor.name,
                specialization: doctor.specialization,
              }
            : null,
        };
      })
    );

    return recordsWithDetails;
  },
});

// Add new medical record
export const addMedicalRecord = mutation({
  args: {
    patientId: v.id("users"),
    doctorId: v.id("users"),
    appointmentId: v.optional(v.id("appointments")),
    diagnosis: v.string(),
    reports: v.optional(v.array(v.string())),
    prescription: v.optional(v.string()),
    notes: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify patient and doctor exist
    const patient = await ctx.db.get(args.patientId);
    const doctor = await ctx.db.get(args.doctorId);

    if (!patient || patient.role !== "patient") {
      throw new Error("Patient not found");
    }

    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Doctor not found");
    }

    const recordId = await ctx.db.insert("medicalRecords", {
      patientId: args.patientId,
      doctorId: args.doctorId,
      appointmentId: args.appointmentId,
      diagnosis: args.diagnosis,
      reports: args.reports,
      prescription: args.prescription,
      notes: args.notes,
      date: args.date,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { recordId, success: true };
  },
});

// Get medical record by ID
export const getRecordById = query({
  args: {
    recordId: v.id("medicalRecords"),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db.get(args.recordId);
    if (!record) {
      return null;
    }

    const patient = await ctx.db.get(record.patientId);
    const doctor = await ctx.db.get(record.doctorId);

    return {
      ...record,
      patient: patient ? { name: patient.name, email: patient.email } : null,
      doctor: doctor
        ? {
            name: doctor.name,
            specialization: doctor.specialization,
          }
        : null,
    };
  },
});

