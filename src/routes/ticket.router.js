import { Router } from "express";
import { getAll, getById, purchaseTicket } from "../controllers/ticket.controller.js";
const router = Router();

router.get("/", getAll);
router.get("/:tid", getById);

router.post("/:uid/:eid", purchaseTicket);

export default router;