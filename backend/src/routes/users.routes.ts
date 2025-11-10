import { Router } from "express";
import {
  getUserByIdHandler,
  listDoctorsHandler,
  listUsersHandler,
  deleteUserHandler,
  updateAvailabilityHandler,
  updateUserProfileHandler,
} from "../controllers/users.controller";

const usersRouter = Router();

usersRouter.get("/", listUsersHandler);
usersRouter.get("/doctors", listDoctorsHandler);
usersRouter.get("/:id", getUserByIdHandler);
usersRouter.patch("/:id", updateUserProfileHandler);
usersRouter.patch("/:id/availability", updateAvailabilityHandler);
usersRouter.post("/availability", updateAvailabilityHandler);
usersRouter.delete("/:id", deleteUserHandler);

export default usersRouter;
