import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma";
import {
  notificationToJSON,
} from "../utils/transformers";
import { toPrismaNotificationType } from "../utils/enums";

interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  message: string;
  appointmentId?: string | null;
  medicalRecordId?: string | null;
  actionUrl?: string | null;
}

export const createNotification = async (
  input: CreateNotificationInput,
) => {
  const now = new Date();

  const notification = await prisma.notification.create({
    data: {
      id: randomUUID(),
      userId: input.userId,
      type: toPrismaNotificationType(input.type),
      title: input.title,
      message: input.message,
      read: false,
      appointmentId: input.appointmentId ?? null,
      medicalRecordId: input.medicalRecordId ?? null,
      actionUrl: input.actionUrl ?? null,
      createdAt: now,
    },
  });

  return notificationToJSON(notification);
};


