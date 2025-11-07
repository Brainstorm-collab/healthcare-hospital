import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users collection - patients and doctors
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()), // Will be hashed, optional for social logins
    role: v.union(v.literal("patient"), v.literal("doctor")),
    // Social login fields
    provider: v.optional(v.string()), // 'google', 'apple', etc.
    providerId: v.optional(v.string()), // Social provider's user ID
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    // Doctor-specific fields
    specialization: v.optional(v.string()),
    experience: v.optional(v.string()),
    consultationFee: v.optional(v.number()),
    rating: v.optional(v.number()),
    patientStories: v.optional(v.number()),
    clinic: v.optional(v.string()),
    location: v.optional(v.string()),
    // Availability
    isAvailable: v.optional(v.boolean()),
    availableSlots: v.optional(v.array(v.string())),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_specialization", ["specialization"]),

  // Appointments collection
  appointments: defineTable({
    patientId: v.id("users"),
    doctorId: v.id("users"),
    date: v.string(), // ISO date string
    time: v.string(), // Time slot
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    type: v.union(v.literal("online"), v.literal("offline")),
    notes: v.optional(v.string()),
    prescription: v.optional(v.string()), // File URL or text
    consultationNotes: v.optional(v.string()),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_patient", ["patientId"])
    .index("by_doctor", ["doctorId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"])
    .index("by_patient_and_status", ["patientId", "status"])
    .index("by_doctor_and_status", ["doctorId", "status"]),

  // Departments collection
  departments: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    // Array of doctor IDs in this department
    doctorIds: v.optional(v.array(v.id("users"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_name", ["name"]),

  // Medical Records collection
  medicalRecords: defineTable({
    patientId: v.id("users"),
    doctorId: v.id("users"),
    appointmentId: v.optional(v.id("appointments")),
    diagnosis: v.string(),
    reports: v.optional(v.array(v.string())), // File URLs
    prescription: v.optional(v.string()),
    notes: v.optional(v.string()),
    date: v.string(), // ISO date string
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_patient", ["patientId"])
    .index("by_doctor", ["doctorId"])
    .index("by_appointment", ["appointmentId"])
    .index("by_date", ["date"]),

  // News/Blog collection
  news: defineTable({
    title: v.string(),
    category: v.string(),
    content: v.string(),
    author: v.string(),
    image: v.optional(v.string()),
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_published", ["published"])
    .index("by_category", ["category"]),

  // FAQs collection
  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    category: v.optional(v.string()),
    order: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_order", ["order"]),

  // Notifications collection
  notifications: defineTable({
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
    read: v.boolean(),
    // Related entity IDs for navigation
    appointmentId: v.optional(v.id("appointments")),
    medicalRecordId: v.optional(v.id("medicalRecords")),
    // Action link
    actionUrl: v.optional(v.string()),
    // Timestamps
    createdAt: v.number(),
    readAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "read"])
    .index("by_user_and_created", ["userId", "createdAt"]),
});

