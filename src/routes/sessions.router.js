import { Router } from "express";
import { loginController, registerController, currentController, logoutController } from "../controllers/sessions.controller.js";
import { ensureSession } from "../middlewares/sessions.middleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/current", ensureSession, currentController);
router.delete("/logout", logoutController);
export default router;