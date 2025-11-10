import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import {
  toPrismaAppointmentStatus,
  toPrismaAppointmentType,
} from "../utils/enums";
import { appointmentToJSON } from "../utils/transformers";
import { createNotification } from "../services/notifications.service";

const parseDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date value");
  }
  return date;
};

export const createAppointmentHandler = asyncHandler(async (req: Request, res: Response) => {
  const {
    patientId,
    doctorId,
    date,
    time,
    type,
    notes,
  } = req.body ?? {};

  if (!patientId || !doctorId || !date || !time || !type) {
    return res.status(400).json({ error: "patientId, doctorId, date, time, and type are required." });
  }

  const [patient, doctor] = await Promise.all([
    prisma.user.findUnique({ where: { id: patientId } }),
    prisma.user.findUnique({ where: { id: doctorId } }),
  ]);

  if (!patient || patient.role !== "PATIENT") {
    return res.status(404).json({ error: "Patient not found." });
  }

  if (!doctor || doctor.role !== "DOCTOR") {
    return res.status(404).json({ error: "Doctor not found." });
  }

  if (doctor.isAvailable === false) {
    return res.status(400).json({ error: "Doctor is not available." });
  }

  const now = new Date();
  let appointmentDate: Date;
  try {
    appointmentDate = parseDate(date);
  } catch (error) {
    return res.status(400).json({ error: "Invalid appointment date." });
  }

  let appointmentType;
  try {
    appointmentType = toPrismaAppointmentType(type);
  } catch (error) {
    return res.status(400).json({ error: "Invalid appointment type." });
  }

  const appointment = await prisma.appointment.create({
    data: {
      id: randomUUID(),
      patientId,
      doctorId,
      date: appointmentDate,
      time,
      status: "PENDING",
      type: appointmentType,
      notes,
      createdAt: now,
      updatedAt: now,
    },
    include: { patient: true, doctor: true },
  });

  const readableDate = appointment.date.toLocaleDateString();

  await Promise.all([
    createNotification({
      userId: patientId,
      type: "appointment_created",
      title: "Appointment Booked",
      message: `Your appointment with Dr. ${doctor.name} on ${readableDate} at ${time} has been booked successfully.`,
      appointmentId: appointment.id,
      actionUrl: "/appointments",
    }),
    createNotification({
      userId: doctorId,
      type: "appointment_created",
      title: "New Appointment Request",
      message: `${patient.name} has requested an appointment on ${readableDate} at ${time}.`,
      appointmentId: appointment.id,
      actionUrl: "/appointments",
    }),
  ]);

  return res.status(201).json({ success: true, appointment: appointmentToJSON(appointment) });
});

export const getAppointmentsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { userId, role, status } = req.query as {
    userId?: string;
    role?: string;
    status?: string;
  };

  if (!userId || !role) {
    return res.status(400).json({ error: "userId and role are required." });
  }

  if (role !== "patient" && role !== "doctor") {
    return res.status(400).json({ error: "role must be patient or doctor." });
  }

  const where: {
    patientId?: string;
    doctorId?: string;
    status?: any;
  } = {};

  if (role === "patient") {
    where.patientId = userId;
  } else {
    where.doctorId = userId;
  }

  if (status) {
    try {
      where.status = toPrismaAppointmentStatus(status);
    } catch (error) {
      return res.status(400).json({ error: "Invalid appointment status." });
    }
  }

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    include: { patient: true, doctor: true },
  });

  return res.json(appointments.map(appointmentToJSON));
});

export const getAppointmentByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Appointment id is required." });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, doctor: true },
  });

  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found." });
  }

  return res.json(appointmentToJSON(appointment));
});

export const updateAppointmentStatusHandler = asyncHandler(async (req: Request, res: Response) => {
  const appointmentId = req.params.id ?? req.body?.appointmentId;
  const { status } = req.body ?? {};

  if (!appointmentId || !status) {
    return res.status(400).json({ error: "appointmentId and status are required." });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true, doctor: true },
  });

  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found." });
  }

  let newStatus;
  try {
    newStatus = toPrismaAppointmentStatus(status);
  } catch (error) {
    return res.status(400).json({ error: "Invalid appointment status." });
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: newStatus,
      updatedAt: new Date(),
    },
    include: { patient: true, doctor: true },
  });

  if (appointment.status !== newStatus) {
    const appointmentDate = updated.date.toLocaleDateString();
    const promises: Promise<unknown>[] = [];

    if (newStatus === "CONFIRMED") {
      promises.push(
        createNotification({
          userId: updated.patientId,
          type: "appointment_confirmed",
          title: "Appointment Confirmed",
          message: `Your appointment with Dr. ${updated.doctor?.name ?? "Doctor"} on ${appointmentDate} at ${updated.time} has been confirmed.`,
          appointmentId: updated.id,
          actionUrl: "/appointments",
        }),
      );
    } else if (newStatus === "CANCELLED") {
      promises.push(
        createNotification({
          userId: updated.patientId,
          type: "appointment_cancelled",
          title: "Appointment Cancelled",
          message: `Your appointment with Dr. ${updated.doctor?.name ?? "Doctor"} on ${appointmentDate} has been cancelled.`,
          appointmentId: updated.id,
          actionUrl: "/appointments",
        }),
        createNotification({
          userId: updated.doctorId,
          type: "appointment_cancelled",
          title: "Appointment Cancelled",
          message: `Appointment with ${updated.patient?.name ?? "Patient"} on ${appointmentDate} has been cancelled.`,
          appointmentId: updated.id,
          actionUrl: "/appointments",
        }),
      );
    } else if (newStatus === "COMPLETED") {
      promises.push(
        createNotification({
          userId: updated.patientId,
          type: "appointment_completed",
          title: "Appointment Completed",
          message: `Your appointment with Dr. ${updated.doctor?.name ?? "Doctor"} on ${appointmentDate} has been completed.`,
          appointmentId: updated.id,
          actionUrl: "/medical-records",
        }),
      );
    }

    await Promise.all(promises);
  }

  return res.json({ success: true, appointment: appointmentToJSON(updated) });
});

export const updateAppointmentDetailsHandler = asyncHandler(async (req: Request, res: Response) => {
  const appointmentId = req.params.id ?? req.body?.appointmentId;
  const { consultationNotes, prescription } = req.body ?? {};

  if (!appointmentId) {
    return res.status(400).json({ error: "appointmentId is required." });
  }

  const appointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      consultationNotes: consultationNotes ?? undefined,
      prescription: prescription ?? undefined,
      updatedAt: new Date(),
    },
    include: { patient: true, doctor: true },
  });

  return res.json({ success: true, appointment: appointmentToJSON(appointment) });
});


