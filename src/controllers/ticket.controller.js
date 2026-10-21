import {eventModel} from "../models/event.model.js"
import {ticketModel} from "../models/ticket.model.js"

export const createTicket = async (req, res) => {
    try {
        
        const {eventId, quantity} = req.body

        const event = await eventModel.findById(eventId)

        //validar que el evento exista
        if(!event){
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            })
        }
         
        //validar que el evento esté publicado
        if(event.status !== "published"){
            return res.status(400).json({
                status: "error",
                message: "El evento no está publicado"
            })
        }

        //validar que el evento no haya pasado
        if(event.date <= new Date()){
            return res.status(400).json({
                status: "error",
                message: "El evento ya ha pasado"
            })
        }

         
        const existingTicket = await ticketModel.findOne({ 
            user: req.user._id,
            event:event._id,
            status: "active"
        })

        //validar que el usuario no tenga un ticket para este evento
        if(existingTicket){
            return res.status(400).json({
                status: "error",
                message: "Ya tienes un ticket para este evento"
            })
        }

        //calcular las entradas reservadas
        const result = await ticketModel.aggregate([
            {$match: {event: event._id, status: "active"}},

            {$group: {_id: "$event", totalReserved: {$sum: "$quantity"}}}
            
        ]) 

        const reserved = result[0]?.totalReserved || 0

        const available = event.capacity - reserved

        //validar que haya suficientes entradas disponibles
        if(available < quantity){
            return res.status(400).json({
                status: "error",
                message: "No hay suficientes entradas disponibles"
            })
        }


        //crear el ticket
        const ticket = await ticketModel.create({
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