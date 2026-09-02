import { Router } from "express";
import { update, getAll, getByEmail } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:email", getByEmail);

router.put("/:email", update);

export default router;