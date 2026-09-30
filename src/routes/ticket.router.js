import passport from "passport";
import { Router } from "express";
import { getAll, getById, purchaseTicket } from "../controllers/ticket.controller.js";
import { ticketPermission } from "../middlewares/session.middleware.js";

const router = Router();

router.use(passport.authenticate("current", { session: false }));

// este lo dejamos para más adelante
router.get("/", getAll); //admin, organizador (solo a los propios)
router.get("/:tid", getById);//admin, organizador (solo a los propios)

router.post("/:uid/:eid", ticketPermission, purchaseTicket);//acceden todos, con condiciones

export default router;