import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { medicalRecordToJSON } from "../utils/transformers";

export const getRecordsByPatientHandler = asyncHandler(async (req: Request, res: Response) => {
  const { patientId } = req.query as { patientId?: string };

  if (!patientId) {
    return res.status(400).json({ error: "patientId is required." });
  }

  const records = await prisma.medicalRecord.findMany({
    where: { patientId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    include: { doctor: true, patient: true },
  });

  return res.json(records.map(medicalRecordToJSON));
});

export const getMedicalRecordByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "record id is required." });
  }

  const record = await prisma.medicalRecord.findUnique({
    where: { id },
    include: { doctor: true, patient: true },
  });

  if (!record) {
    return res.status(404).json({ error: "Medical record not found." });
  }

  return res.json(medicalRecordToJSON(record));
});


