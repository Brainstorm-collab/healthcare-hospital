import { Router } from "express";
import {
  loginHandler,
  registerHandler,
  socialLoginHandler,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/social-login", socialLoginHandler);

export default authRouter;
