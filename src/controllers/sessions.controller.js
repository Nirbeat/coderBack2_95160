import { registerUser } from "../services/sessions.services.js";

export async function registerController (req, res){

    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            status: 'success',
            payload: user
        })
        
    } catch (error) {
        //completar
        if(error.message === "Faltan campos obligatorios" ||
            error.message === "Formato de email inválido" ||
            error.message === "La contraseña debe tener al menos 6 caracteres"
        ) {
            return res.status(400).json({
                status: 'error',
                message: error.message
            })
        } else if(error.message === "El email ya está registrado") {
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