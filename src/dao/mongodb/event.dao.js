import { eventModel } from "../../models/event.model.js";

class EventDAO {

    async paginate(filter, options) {
        return await eventModel.paginate(filter, options);
    }

    async create(event) {
        return await eventModel.create(event);
    }

    async findById(eventId) {
        return await eventModel.findById(eventId);
    }
}

export default new EventDAO();