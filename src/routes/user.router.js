import { Router } from "express";
import { update, getAll, getByEmail } from "../controllers/user.controller.js";
import passport from "passport";
import { rolesPermission } from "../middlewares/session.middleware.js";
const router = Router();

router.use(passport.authenticate("current", { session: false }), rolesPermission(["admin"]));

router.get("/", getAll);
router.get("/:email", getByEmail);

router.put("/:email", update);

export default router;