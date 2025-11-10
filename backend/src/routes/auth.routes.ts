// Auth endpoints: email/password and social login.
import { Router } from "express";
import {
  loginHandler,
  registerHandler,
  socialLoginHandler,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", registerHandler);      // POST /api/auth/register
authRouter.post("/login", loginHandler);            // POST /api/auth/login
authRouter.post("/social-login", socialLoginHandler); // POST /api/auth/social-login

export default authRouter;
