import { Router } from "express";
import {
  createAppointmentHandler,
  getAppointmentByIdHandler,
  getAppointmentsHandler,
  updateAppointmentDetailsHandler,
  updateAppointmentStatusHandler,
} from "../controllers/appointments.controller";

const appointmentsRouter = Router();

appointmentsRouter.get("/", getAppointmentsHandler);
appointmentsRouter.get("/:id", getAppointmentByIdHandler);
appointmentsRouter.post("/", createAppointmentHandler);
appointmentsRouter.patch("/:id/status", updateAppointmentStatusHandler);
appointmentsRouter.patch("/:id/details", updateAppointmentDetailsHandler);
appointmentsRouter.post("/status", updateAppointmentStatusHandler);
appointmentsRouter.post("/details", updateAppointmentDetailsHandler);

export default appointmentsRouter;
