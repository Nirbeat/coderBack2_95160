import { Router } from "express";
import { loginController, registerController, currentController, logoutController } from "../controllers/sessions.controller.js";
import passport from "passport"

const router = Router();

router.post("/register", passport.authenticate("register",  { session: false }),registerController);

router.post("/login", passport.authenticate("login", { session: false }), loginController);

router.get("/current", passport.authenticate("current", { session: false }), currentController);

router.post("/logout", logoutController); // Logout solo elimina la cookie, no necesita Passport

 
export default router;