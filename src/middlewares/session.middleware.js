import { eventModel } from "../models/eventModel.js";

export function rolesPermission(roles) {
    return function (req, res, next) {
        try {
            if (roles.includes(req.user.role)) next();
            else throw new Error("Acceso no permitido");
        } catch (error) {
            res.status(403).json({ error: error.message });
        }
    }
}


export async function ticketPermission(req, res, next) {
    try {
        if (req.user.role == "user") next();
        if (req.user.role == "admin" || req.user.role == "organizer") {
            const event = await eventModel.findById(req.params.eid);
            if (event.organizer == req.user.id) {
                throw new Error("No puedes comprar un ticket propio");
            }
        }
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
}
