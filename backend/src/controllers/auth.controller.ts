import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { toPrismaRole } from "../utils/enums";
import { userToJSON } from "../utils/transformers";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const SALT_ROUNDS = 10;

export const registerHandler = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    address,
    specialization,
    experience,
    consultationFee,
    clinic,
    location,
  } = req.body ?? {};

  if (!name || !email || !role) {
    return res.status(400).json({ error: "Name, email, and role are required." });
  }

  if (role !== "patient" && role !== "doctor") {
    return res.status(400).json({ error: "Role must be either 'patient' or 'doctor'." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required for email registration." });
  }

  const normalizedEmail = normalizeEmail(email);
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return res.status(409).json({ error: "User with this email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const now = new Date();
  const feeValue =
    consultationFee !== undefined && consultationFee !== null
      ? Number(consultationFee)
      : undefined;

  const data: Prisma.UserCreateInput = {
    id: randomUUID(),
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: toPrismaRole(role),
    createdAt: now,
    updatedAt: now,
  };

  if (phone !== undefined) data.phone = phone;
  if (address !== undefined) data.address = address;
  if (specialization !== undefined) data.specialization = specialization;
  if (experience !== undefined) data.experience = experience;
  if (clinic !== undefined) data.clinic = clinic;
  if (location !== undefined) data.location = location;
  if (feeValue !== undefined) {
    data.consultationFee = new Prisma.Decimal(feeValue);
  }

  if (role === "doctor") {
    data.isAvailable = true;
    data.availableSlots = [];
  }

  const user = await prisma.user.create({ data });

  return res.status(201).json({ success: true, user: userToJSON(user) });
});

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !user.password) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { updatedAt: new Date() },
  });

  return res.json(userToJSON(user));
});

export const socialLoginHandler = asyncHandler(async (req: Request, res: Response) => {
  const {
    provider,
    providerId,
    email,
    name,
    picture,
    role,
  } = req.body ?? {};

  if (!provider || !providerId || !email || !name) {
    return res.status(400).json({ error: "Provider, providerId, name, and email are required." });
  }

  const normalizedEmail = normalizeEmail(email);
  const normalizedRole =
    role === "doctor" ? "doctor" : role === "patient" ? "patient" : undefined;

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (user) {
    const updates: Prisma.UserUpdateInput = {
      updatedAt: new Date(),
    };

    if (!user.provider || !user.providerId) {
      updates.provider = provider;
      updates.providerId = providerId;
    }

    if (picture && picture !== user.profileImage) {
      updates.profileImage = picture;
    }

    if (name && name !== user.name) {
      updates.name = name;
    }

    if (Object.keys(updates).length > 1) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updates,
      });
    }
  } else {
    if (!normalizedRole) {
      return res.status(400).json({ error: "Role must be provided for new social logins." });
    }

    const now = new Date();
    const data: Prisma.UserCreateInput = {
      id: randomUUID(),
      name,
      email: normalizedEmail,
      role: toPrismaRole(normalizedRole),
      provider,
      providerId,
      profileImage: picture,
      createdAt: now,
      updatedAt: now,
    };

    if (normalizedRole === "doctor") {
      data.isAvailable = true;
      data.availableSlots = [];
    }

    user = await prisma.user.create({ data });
  }

  return res.json(userToJSON(user));
});


