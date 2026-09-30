import { eventModel } from "../models/eventModel.js";

export async function getAll(req, res, next) {
    try {
        const events = await eventModel.find({}).populate("organizer");
        res.status(200).json({ message: "success", events })
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

export async function createEvent(req, res, next) {
    try {
        const newEvent = await eventModel.create({ ...req.body, organizer: req.user.id });

        res.status(200).json({ success: "evento creado", newEvent });
    } catch (error) {
        console.log(error);
    }
}

export async function updateEvent(req, res, next) {
    try {

    } catch (error) {
        console.log(error);
    }
}

export async function deleteEvent(req, res, next) {
    try {

    } catch (error) {
        console.log(error);
    }
}