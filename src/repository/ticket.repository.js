class TicketRepository {
    constructor(ticketDao, eventDao) {
        this.ticketDao = ticketDao;
        this.eventDao = eventDao;
    }

    async findEventById(eventId) {
        return await this.eventDao.findById(eventId)
    }

    async getTicket(data) {
        return await this.ticketDao.findOne(data)
    }

    async aggregateEvent(event) {
        return await this.ticketDao.aggregate(event)
    }

    async createTicket(data) {
        return this.ticketDao.create(data)
    }
}

export default TicketRepository;