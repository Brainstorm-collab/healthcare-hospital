// User controller: user CRUD, availability updates, and doctor list with pagination.
import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { toPrismaRole } from "../utils/enums";
import { doctorListItem, userToJSON } from "../utils/transformers";

// GET /api/users
export const listUsersHandler = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.query as { role?: string };

  const where: Prisma.UserWhereInput = role
    ? { role: toPrismaRole(role as "patient" | "doctor") }
    : {};

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return res.json(users.map(userToJSON));
});

// GET /api/users/:id
export const getUserByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User id is required." });
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.json(userToJSON(user));
});

// PATCH /api/users/:id
export const updateUserProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id ?? req.body?.userId;

  if (!userId) {
    return res.status(400).json({ error: "User id is required." });
  }

  const {
    name,
    phone,
    address,
    profileImage,
    specialization,
    experience,
    consultationFee,
    clinic,
    location,
    isAvailable,
  } = req.body ?? {};

  const updates: Prisma.UserUpdateInput = {
    ...(name !== undefined ? { name } : {}),
    ...(phone !== undefined ? { phone } : {}),
    ...(address !== undefined ? { address } : {}),
    ...(profileImage !== undefined ? { profileImage } : {}),
    ...(specialization !== undefined ? { specialization } : {}),
    ...(experience !== undefined ? { experience } : {}),
    ...(clinic !== undefined ? { clinic } : {}),
    ...(location !== undefined ? { location } : {}),
    ...(isAvailable !== undefined ? { isAvailable } : {}),
  };

  if (consultationFee !== undefined) {
    updates.consultationFee =
      consultationFee === null || consultationFee === ""
        ? null
        : new Prisma.Decimal(consultationFee);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No updates provided." });
  }

  updates.updatedAt = new Date();

  const user = await prisma.user.update({
    where: { id: userId },
    data: updates,
  });

  return res.json({ success: true, user: userToJSON(user) });
});

// PATCH /api/users/:id/availability (or POST /api/users/availability)
export const updateAvailabilityHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id ?? req.body?.doctorId;
  const { isAvailable, availableSlots } = req.body ?? {};

  if (!userId) {
    return res.status(400).json({ error: "Doctor id is required." });
  }

  if (isAvailable === undefined) {
    return res.status(400).json({ error: "isAvailable is required." });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      isAvailable,
      availableSlots: availableSlots ?? undefined,
      updatedAt: new Date(),
    },
  });

  return res.json({ success: true, user: userToJSON(user) });
});

// DELETE /api/users/:id
export const deleteUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User id is required." });
  }

  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    return res.status(404).json({ error: "User not found." });
  }

  await prisma.$transaction(async (tx) => {
    await tx.notification.deleteMany({ where: { userId: id } });
    await tx.medicalRecord.deleteMany({
      where: {
        OR: [{ patientId: id }, { doctorId: id }],
      },
    });
    await tx.appointment.deleteMany({
      where: {
        OR: [{ patientId: id }, { doctorId: id }],
      },
    });
    await tx.user.delete({ where: { id } });
  });

  return res.json({ success: true });
});

// GET /api/users/doctors
// Supports query filters: specialization, location, search, page, limit
export const listDoctorsHandler = asyncHandler(async (req: Request, res: Response) => {
  const {
    specialization,
    location,
    search,
    page: pageParam,
    limit: limitParam,
  } = req.query as {
    specialization?: string;
    location?: string;
    search?: string;
    page?: string;
    limit?: string;
  };

  const page = Math.max(parseInt(pageParam ?? "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(limitParam ?? "12", 10), 1), 100);
  const skip = (page - 1) * limit;

  const filters: Prisma.UserWhereInput = {
    role: "DOCTOR",
  };

  if (specialization) {
    filters.specialization = { equals: specialization, mode: "insensitive" };
  }

  if (location) {
    filters.location = { contains: location, mode: "insensitive" };
  }

  if (search) {
    filters.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { specialization: { contains: search, mode: "insensitive" } },
      { clinic: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, doctors] = await Promise.all([
    prisma.user.count({ where: filters }),
    prisma.user.findMany({
      where: filters,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return res.json({
    data: doctors.map(doctorListItem),
    pagination: {
      page,
      limit,
      total,
      hasMore: page * limit < total,
    },
  });
});

