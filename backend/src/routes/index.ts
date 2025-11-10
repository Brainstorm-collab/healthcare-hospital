// Root API router: composes feature routers under /api/*
import { Router } from "express";
import authRouter from "./auth.routes";
import usersRouter from "./users.routes";
import appointmentsRouter from "./appointments.routes";
import notificationsRouter from "./notifications.routes";
import medicalRecordsRouter from "./medicalRecords.routes";

const router = Router();

// Simple liveness check for monitoring
router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/appointments", appointmentsRouter);
router.use("/notifications", notificationsRouter);
router.use("/medical-records", medicalRecordsRouter);

export default router;
