// User endpoints: listing, fetching, updating profile and availability.
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

usersRouter.get("/", listUsersHandler);                     // GET /api/users
usersRouter.get("/doctors", listDoctorsHandler);            // GET /api/users/doctors
usersRouter.get("/:id", getUserByIdHandler);                // GET /api/users/:id
usersRouter.patch("/:id", updateUserProfileHandler);        // PATCH /api/users/:id
usersRouter.patch("/:id/availability", updateAvailabilityHandler); // PATCH /api/users/:id/availability
usersRouter.post("/availability", updateAvailabilityHandler);      // POST /api/users/availability
usersRouter.delete("/:id", deleteUserHandler);              // DELETE /api/users/:id

export default usersRouter;
