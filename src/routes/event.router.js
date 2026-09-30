import passport from "passport";
import { Router } from "express";
import { getAll, getById, createEvent, deleteEvent, updateEvent } from "../controllers/event.controller.js";
import { rolesPermission } from "../middlewares/session.middleware.js";

const router = Router();

router.use(passport.authenticate("current", { session: false }));

router.get("/", getAll);
router.get("/:eid", getById);

router.use(rolesPermission(["organizer", "admin"]));

router.post("/", createEvent);
router.put("/:eid", updateEvent);
router.delete("/:eid", deleteEvent);

export default router;