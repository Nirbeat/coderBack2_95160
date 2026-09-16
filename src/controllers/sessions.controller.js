import { loginUser, registerUser } from "../services/sessions.services.js";
import { generateToken, verifyToken } from "../utils/jwt.js";

export async function registerController(req, res) {

    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            status: 'success',
            payload: user
        })

    } catch (error) {
        //completar
        if (error.message === "Faltan campos obligatorios" ||
            error.message === "Formato de email inválido" ||
            error.message === "La contraseña debe tener al menos 6 caracteres"
        ) {
            return res.status(400).json({
                status: 'error',
                message: error.message
            })
        } else if (error.message === "El email ya está registrado") {
            return res.status(409).json({
                status: 'error',
                message: error.message
            })
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor'
            })
        }
    }
}

export async function loginController(req, res, next) {
    try {
        const user = await loginUser(req.body);
        const token = generateToken(user.toJSON());
        res.status(200)
            .cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60, signed: true })
            .json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function logoutController(req, res, next) {
    try {
        res.status(200).clearCookie("jwt").json({ message: "sesion finalizada exitosamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * 
 * @param {*} req 
 * @param {import("express").Response} res 
 * @param {*} next 
 */
export async function currentController(req, res, next) {
    try {
        const user = verifyToken(req.signedCookies.jwt);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: "sesion expirada" });
    }
}
