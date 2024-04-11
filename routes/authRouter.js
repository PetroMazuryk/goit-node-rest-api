import express from "express";
import validateBody from "../helpers/validateBody.js";
import { schemas } from "../models/users.js";
import ctrl from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrl.register
);

authRouter.post("/login", validateBody(schemas.loginSchema), ctrl.login);

export default authRouter;
