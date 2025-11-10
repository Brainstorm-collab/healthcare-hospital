import type {
  Appointment,
  MedicalRecord,
  Notification,
  User,
} from "../generated/prisma/client";
import type { Prisma } from "../generated/prisma/client";
import {
  fromPrismaAppointmentStatus,
  fromPrismaAppointmentType,
  fromPrismaNotificationType,
  fromPrismaRole,
} from "./enums";

const decimalToNumber = (value?: Prisma.Decimal | null) =>
  value === null || value === undefined ? null : Number(value);

const dateToMillis = (value: Date | null | undefined) =>
  value ? value.getTime() : null;

export const userToJSON = (user: User) => ({
  id: user.id,
  _id: user.id,
  name: user.name,
  email: user.email,
  role: fromPrismaRole(user.role),
  phone: user.phone ?? "",
  address: user.address ?? "",
  provider: user.provider ?? undefined,
  providerId: user.providerId ?? undefined,
  profileImage: user.profileImage ?? "",
  specialization: user.specialization ?? "",
  experience: user.experience ?? "",
  consultationFee: decimalToNumber(user.consultationFee),
  rating: decimalToNumber(user.rating),
  patientStories: user.patientStories ?? null,
  clinic: user.clinic ?? "",
  location: user.location ?? "",
  isAvailable: user.isAvailable ?? false,
  availableSlots: user.availableSlots ?? [],
  createdAt: dateToMillis(user.createdAt),
  updatedAt: dateToMillis(user.updatedAt),
});

export const userSummary = (user: User | null) =>
  user
    ? {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email ?? "",
        phone: user.phone ?? "",
        profileImage: user.profileImage ?? "",
        specialization: user.specialization ?? "",
        clinic: user.clinic ?? "",
        location: user.location ?? "",
        role: fromPrismaRole(user.role),
      }
    : null;

export type AppointmentWithRelations = Appointment & {
  patient?: User | null;
  doctor?: User | null;
};

export const appointmentToJSON = (appointment: AppointmentWithRelations) => ({
  id: appointment.id,
  _id: appointment.id,
  patientId: appointment.patientId,
  doctorId: appointment.doctorId,
  date: appointment.date.toISOString(),
  time: appointment.time,
  status: fromPrismaAppointmentStatus(appointment.status),
  type: fromPrismaAppointmentType(appointment.type),
  notes: appointment.notes ?? "",
  prescription: appointment.prescription ?? "",
  consultationNotes: appointment.consultationNotes ?? "",
  createdAt: dateToMillis(appointment.createdAt),
  updatedAt: dateToMillis(appointment.updatedAt),
  patient: userSummary(appointment.patient ?? null),
  doctor: userSummary(appointment.doctor ?? null),
});

export type MedicalRecordWithRelations = MedicalRecord & {
  doctor?: User | null;
  patient?: User | null;
};

export const medicalRecordToJSON = (record: MedicalRecordWithRelations) => ({
  id: record.id,
  _id: record.id,
  patientId: record.patientId,
  doctorId: record.doctorId,
  appointmentId: record.appointmentId ?? null,
  diagnosis: record.diagnosis,
  reports: record.reports ?? [],
  prescription: record.prescription ?? "",
  notes: record.notes ?? "",
  date: record.date.toISOString(),
  createdAt: dateToMillis(record.createdAt),
  updatedAt: dateToMillis(record.updatedAt),
  doctor: record.doctor
    ? {
        id: record.doctor.id,
        _id: record.doctor.id,
        name: record.doctor.name,
        specialization: record.doctor.specialization ?? "",
      }
    : null,
  patient: userSummary(record.patient ?? null),
});

export const notificationToJSON = (notification: Notification) => ({
  id: notification.id,
  _id: notification.id,
  userId: notification.userId,
  type: fromPrismaNotificationType(notification.type),
  title: notification.title,
  message: notification.message,
  read: notification.read,
  appointmentId: notification.appointmentId ?? null,
  medicalRecordId: notification.medicalRecordId ?? null,
  actionUrl: notification.actionUrl ?? "",
  createdAt: dateToMillis(notification.createdAt),
  readAt: dateToMillis(notification.readAt ?? null),
});

export const doctorListItem = (user: User) => ({
  id: user.id,
  _id: user.id,
  name: user.name,
  specialization: user.specialization ?? "",
  experience: user.experience ?? "",
  location: user.location ?? "",
  clinic: user.clinic ?? "",
  consultationFee: decimalToNumber(user.consultationFee),
  rating: decimalToNumber(user.rating),
  patientStories: user.patientStories ?? null,
  profileImage: user.profileImage ?? "",
  isAvailable: user.isAvailable ?? false,
});


