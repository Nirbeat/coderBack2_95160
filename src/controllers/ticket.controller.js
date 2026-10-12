import { ticketModel } from "../models/ticket.model.js"

export async function getAll(req, res, next) {
    try {

    } catch (error) {
        console.log(error);
    }
}

export async function getById(req, res, next) {
    try {

    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {*} next 
 */
export async function purchaseTicket(req, res, next) {
    try {
        const { eid, uid } = req.params;

        const newTicket = await ticketModel.create({ event: eid, user: uid });

        res.status(200).json({ message: "success", newTicket });
    } catch (error) {
        console.log(error);
    }
}
