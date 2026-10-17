import { Router } from "express";
import { authenticate, requireGatewaySecret, validateBody } from "shared";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import * as AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateBody(registerSchema), AuthController.register);
router.post("/login", validateBody(loginSchema), AuthController.login);
router.get("/me", authenticate, AuthController.getMe);

export default router;
