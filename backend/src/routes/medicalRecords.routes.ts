import { Router } from "express";
import {
  getMedicalRecordByIdHandler,
  getRecordsByPatientHandler,
} from "../controllers/medicalRecords.controller";

const medicalRecordsRouter = Router();

medicalRecordsRouter.get("/", getRecordsByPatientHandler);
medicalRecordsRouter.get("/:id", getMedicalRecordByIdHandler);

export default medicalRecordsRouter;

