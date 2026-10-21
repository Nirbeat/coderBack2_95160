import eventDao from "../dao/mongodb/event.dao.js"
import ticketDao from "../dao/mongodb/ticket.dao.js"
import { eventModel } from "../models/event.model.js"
import { ticketModel } from "../models/ticket.model.js"
import TicketRepository from "../repository/ticket.repository.js"

const ticketRepository = new TicketRepository(ticketDao, eventDao);

export const createTicket = async (req, res) => {
    try {

        const { eventId, quantity } = req.body

        const event = await ticketRepository.findEventById(eventId)

        //validar que el evento exista
        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            })
        }

        //validar que el evento esté publicado
        if (event.status !== "published") {
            return res.status(400).json({
                status: "error",
                message: "El evento no está publicado"
            })
        }

        //validar que el evento no haya pasado
        if (event.date <= new Date()) {
            return res.status(400).json({
                status: "error",
                message: "El evento ya ha pasado"
            })
        }


        const existingTicket = await ticketRepository.getTicket({
            user: req.user._id,
            event: event._id,
            status: "active"
        })

        //validar que el usuario no tenga un ticket para este evento
        if (existingTicket) {
            return res.status(400).json({
                status: "error",
                message: "Ya tienes un ticket para este evento"
            })
        }

        //calcular las entradas reservadas
        const result = await ticketRepository.aggregateEvent(event)

        const reserved = result[0]?.totalReserved || 0

        const available = event.capacity - reserved

        //validar que haya suficientes entradas disponibles
        if (available < quantity) {
            return res.status(400).json({
                status: "error",
                message: "No hay suficientes entradas disponibles"
            })
        }


        //crear el ticket
        const ticket = await ticketRepository.createTicket({
            user: req.user._id,
            event: event._id,
            quantity: quantity
        })

        //responder con el ticket creado
        res.status(201).json({
            status: "success",
            data: ticket
        })


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   