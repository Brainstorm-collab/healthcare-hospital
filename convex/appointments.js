import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { api } from "./_generated/api";

// Create a new appointment
export const createAppointment = mutation({
  args: {
    patientId: v.id("users"),
    doctorId: v.id("users"),
    date: v.string(),
    time: v.string(),
    type: v.union(v.literal("online"), v.literal("offline")),
    notes: v.optional(v.string()),
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

    // Check if doctor is available
    if (!doctor.isAvailable) {
      throw new Error("Doctor is not available");
    }

    // Create appointment
    const appointmentId = await ctx.db.insert("appointments", {
      patientId: args.patientId,
      doctorId: args.doctorId,
      date: args.date,
      time: args.time,
      status: "pending",
      type: args.type,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create notifications for patient and doctor
    const patientName = patient.name;
    const doctorName = doctor.name;
    const appointmentDate = new Date(args.date).toLocaleDateString();

    // Notify patient
    await ctx.runMutation(api.notifications.createNotification, {
      userId: args.patientId,
      type: "appointment_created",
      title: "Appointment Booked",
      message: `Your appointment with Dr. ${doctorName} on ${appointmentDate} at ${args.time} has been booked successfully.`,
      appointmentId,
      actionUrl: `/appointments`,
    });

    // Notify doctor
    await ctx.runMutation(api.notifications.createNotification, {
      userId: args.doctorId,
      type: "appointment_created",
      title: "New Appointment Request",
      message: `${patientName} has requested an appointment on ${appointmentDate} at ${args.time}.`,
      appointmentId,
      actionUrl: `/appointments`,
    });

    return { appointmentId, success: true };
  },
});

// Get appointments by user ID
export const getAppointmentsByUser = query({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("patient"), v.literal("doctor")),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    const index = args.role === "patient" ? "by_patient" : "by_doctor";
    let appointmentsQuery = ctx.db
      .query("appointments")
      .withIndex(index, (q) => q.eq(args.role === "patient" ? "patientId" : "doctorId", args.userId));

    let appointments = await appointmentsQuery.collect();

    // Filter by status if provided
    if (args.status) {
      appointments = appointments.filter((apt) => apt.status === args.status);
    }

    // Sort by date (newest first)
    appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Populate user details
    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (apt) => {
        const patient = await ctx.db.get(apt.patientId);
        const doctor = await ctx.db.get(apt.doctorId);
        return {
          ...apt,
          patient: patient ? { name: patient.name, email: patient.email, phone: patient.phone } : null,
          doctor: doctor
            ? {
                name: doctor.name,
                specialization: doctor.specialization,
                clinic: doctor.clinic,
                location: doctor.location,
              }
            : null,
        };
      })
    );

    return appointmentsWithDetails;
  },
});

// Update appointment status
export const updateAppointmentStatus = mutation({
  args: {
    appointmentId: v.id("appointments"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const oldStatus = appointment.status;
    await ctx.db.patch(args.appointmentId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    // Create notifications for status changes
    const patient = await ctx.db.get(appointment.patientId);
    const doctor = await ctx.db.get(appointment.doctorId);
    const appointmentDate = new Date(appointment.date).toLocaleDateString();

    if (oldStatus !== args.status) {
      if (args.status === "confirmed") {
        // Notify patient
        await ctx.runMutation(api.notifications.createNotification, {
          userId: appointment.patientId,
          type: "appointment_confirmed",
          title: "Appointment Confirmed",
          message: `Your appointment with Dr. ${doctor?.name || "Doctor"} on ${appointmentDate} at ${appointment.time} has been confirmed.`,
          appointmentId: args.appointmentId,
          actionUrl: `/appointments`,
        });
      } else if (args.status === "cancelled") {
        // Notify both patient and doctor
        await ctx.runMutation(api.notifications.createNotification, {
          userId: appointment.patientId,
          type: "appointment_cancelled",
          title: "Appointment Cancelled",
          message: `Your appointment with Dr. ${doctor?.name || "Doctor"} on ${appointmentDate} has been cancelled.`,
          appointmentId: args.appointmentId,
          actionUrl: `/appointments`,
        });
        await ctx.runMutation(api.notifications.createNotification, {
          userId: appointment.doctorId,
          type: "appointment_cancelled",
          title: "Appointment Cancelled",
          message: `Appointment with ${patient?.name || "Patient"} on ${appointmentDate} has been cancelled.`,
          appointmentId: args.appointmentId,
          actionUrl: `/appointments`,
        });
      } else if (args.status === "completed") {
        // Notify patient
        await ctx.runMutation(api.notifications.createNotification, {
          userId: appointment.patientId,
          type: "appointment_completed",
          title: "Appointment Completed",
          message: `Your appointment with Dr. ${doctor?.name || "Doctor"} on ${appointmentDate} has been completed. Check your medical records for details.`,
          appointmentId: args.appointmentId,
          actionUrl: `/medical-records`,
        });
      }
    }

    return { success: true };
  },
});

// Add consultation notes and prescription
export const updateAppointmentDetails = mutation({
  args: {
    appointmentId: v.id("appointments"),
    consultationNotes: v.optional(v.string()),
    prescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    await ctx.db.patch(args.appointmentId, {
      consultationNotes: args.consultationNotes,
      prescription: args.prescription,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get appointment by ID
export const getAppointmentById = query({
  args: {
    appointmentId: v.id("appointments"),
  },
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) {
      return null;
    }

    const patient = await ctx.db.get(appointment.patientId);
    const doctor = await ctx.db.get(appointment.doctorId);

    return {
      ...appointment,
      patient: patient ? { name: patient.name, email: patient.email, phone: patient.phone } : null,
      doctor: doctor
        ? {
            name: doctor.name,
            specialization: doctor.specialization,
            clinic: doctor.clinic,
            location: doctor.location,
          }
        : null,
    };
  },
});

