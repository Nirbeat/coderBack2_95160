import passport from "passport";
import { Router } from "express";
import { 
    getEventsController, 
    getByIdController, 
    createEventController, 
    updateEventController,
    deleteEventController
} from "../controllers/event.controller.js";
import { rolesPermission } from "../middlewares/session.middleware.js";

const router = Router();

router.use(passport.authenticate("current", { session: false }));

router.get("/", getEventsController);
router.get("/:eid", getByIdController);

router.use(rolesPermission(["organizer", "admin"]));

router.post("/", createEventController);
router.put("/:eid", updateEventController);
router.delete("/:eid", deleteEventController);

export default router;