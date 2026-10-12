import { eventsService, createEvent, updateEvent } from "../services/events.services.js";

export async function getEventsController(req, res) {
    try {
        const result = await eventsService(req.query);
        res.status(200).json({ message: "success", ...result })
    } catch (error) {
        console.log(error);
    }
}

export async function getByIdController(req, res, next) {
    try {

    } catch (error) {
        console.log(error);
    }
}

export async function createEventController(req, res, next) {
    try {
        const event = await createEvent(req.body, req.user);
        res.status(201).json({ status: "success", data: event });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export async function updateEventController(req, res, next) {
    try {
        const event = await updateEvent(req.params.id, req.body, req.user);
        res.status(200).json({ status: "success", data: event });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export async function deleteEventController(req, res, next) {
    try {
        const event = await deleteEvent(req.params.id, req.user);
        res.status(200).json({ status: "success", data: event });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}
