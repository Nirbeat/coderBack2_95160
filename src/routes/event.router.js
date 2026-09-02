import { Router } from "express";
import { getAll, getById, createEvent, deleteEvent, updateEvent } from "../controllers/event.controller.js";
const router = Router();

router.get("/", getAll);
router.get("/:eid", getById);

router.post("/", createEvent);
router.put("/:eid", updateEvent);
router.delete("/:eid", deleteEvent);

export default router;