import passport from "passport";
import { Router } from "express";
import { createTicket } from "../controllers/ticket.controller.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const router = Router();

// middleware que valida que el usuario esté autenticado para todas las rutas
router.use(passport.authenticate("current", { session: false }));

router.post("/", authorizeRoles("user", "organizer", "admin"), createTicket)


export default router;