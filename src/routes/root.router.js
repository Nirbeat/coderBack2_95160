import { Router } from "express";
import { healthStatus } from "../controllers/root.controllers.js";

const router = Router();

router.get("/health", healthStatus);

export default router;