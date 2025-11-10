import type {
  AppointmentStatus,
  AppointmentType,
  NotificationType,
  UserRole,
} from "../generated/prisma/client";

type AppRole = "patient" | "doctor";

const roleMap: Record<AppRole, UserRole> = {
  patient: "PATIENT",
  doctor: "DOCTOR",
};

const appointmentStatusMap: Record<string, AppointmentStatus> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

const appointmentTypeMap: Record<string, AppointmentType> = {
  online: "ONLINE",
  offline: "OFFLINE",
};

const notificationTypeMap: Record<string, NotificationType> = {
  appointment_created: "APPOINTMENT_CREATED",
  appointment_confirmed: "APPOINTMENT_CONFIRMED",
  appointment_cancelled: "APPOINTMENT_CANCELLED",
  appointment_completed: "APPOINTMENT_COMPLETED",
  appointment_reminder: "APPOINTMENT_REMINDER",
  prescription_added: "PRESCRIPTION_ADDED",
  medical_record_added: "MEDICAL_RECORD_ADDED",
  system: "SYSTEM",
};

export const toPrismaRole = (role: AppRole): UserRole => roleMap[role];

export const fromPrismaRole = (role: UserRole): AppRole =>
  role === "DOCTOR" ? "doctor" : "patient";

export const toPrismaAppointmentStatus = (status: string): AppointmentStatus => {
  const prismaStatus = appointmentStatusMap[status];
  if (!prismaStatus) {
    throw new Error(`Unsupported appointment status: ${status}`);
  }
  return prismaStatus;
};

export const fromPrismaAppointmentStatus = (
  status: AppointmentStatus,
): string => status.toLowerCase();

export const toPrismaAppointmentType = (type: string): AppointmentType => {
  const prismaType = appointmentTypeMap[type];
  if (!prismaType) {
    throw new Error(`Unsupported appointment type: ${type}`);
  }
  return prismaType;
};

export const fromPrismaAppointmentType = (type: AppointmentType): string =>
  type.toLowerCase();

export const toPrismaNotificationType = (
  type: string,
): NotificationType => {
  const prismaType = notificationTypeMap[type];
  if (!prismaType) {
    throw new Error(`Unsupported notification type: ${type}`);
  }
  return prismaType;
};

export const fromPrismaNotificationType = (
  type: NotificationType,
): string => type.toLowerCase();


