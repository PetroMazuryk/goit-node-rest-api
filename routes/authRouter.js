import express from "express";
import validateBody from "../middlewares/validateBody.js";
import { schemas } from "../models/users.js";
import ctrl from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { updateSubscriptionSchema } from "../schemas/contactsSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrl.register
);

authRouter.post("/login", validateBody(schemas.loginSchema), ctrl.login);

authRouter.get("/current", authenticate, ctrl.getCurrent);

authRouter.post("/logout", authenticate, ctrl.logout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  ctrl.updateSubscriptionUsers
);

export default authRouter;
