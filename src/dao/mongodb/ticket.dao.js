import { ticketModel } from "../../models/ticket.model.js";

class TicketDAO {

    async findOne(data) {
        return await ticketModel.findOne(data);
    }

    async create(data) {
        return await ticketModel.create(data);
    }
    async aggregate(event) {
        return await ticketModel.aggregate([
            { $match: { event: event._id, status: "active" } },

            { $group: { _id: "$event", totalReserved: { $sum: "$quantity" } } }
        ])
    }

}

export default new TicketDAO();