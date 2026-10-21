import { eventModel } from '../models/event.model.js'
import eventDao from '../dao/mongodb/event.dao.js'

const canManageEvent = (event, user) => {
  if (user.role === 'admin') return true
  return event.organizer.toString() === user._id.toString()
}

export const eventsService = async (query = {}) => {
  const status = query.status
  const category = query.category
  const location = query.location

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10

  const sort = query.sort || 'date'

  // REVISAR PARA DTO
  const filter = {}
  if (status) filter.status = status
  if (category) filter.category = category
  if (location) filter.location = location

  const options = {
    page,
    limit,
    sort,
    populate: {
      path: 'organizer',
      select: 'first_name last_name email'
    }
  }

  const result = await eventDao.paginate(filter, options)

  return result
}

export const createEvent = async (eventData, authenticatedUser) => {
  if (!authenticatedUser?._id) {
    throw new Error('Usuario no autenticado')
  }

  const eventDate = new Date(eventData.date)

  if (eventDate <= new Date()) {
    throw new Error('La fecha del evento debe ser futura')
  }

  if (Number(eventData.capacity) <= 0) {
    throw new Error('La capacidad debe ser mayor a cero')
  }

  if (Number(eventData.price ?? 0) < 0) {
    throw new Error('El precio no puede ser negativo')
  }

  const eventToCreate = {
    ...eventData,
    date: eventDate,
    organizer: authenticatedUser._id,
    status: 'draft'
  }

  return eventDao.create(eventToCreate)
}

export const updateEvent = async (eventId, changes, authenticatedUser) => {
  const event = await eventModel.findById(eventId)

  if (!event) {
    throw new Error('Evento no encontrado')
  }

  if (!canManageEvent(event, authenticatedUser)) {
    throw new Error('No podés modificar este evento')
  }

  if (event.status === 'cancelled') {
    throw new Error('Un evento cancelado no puede modificarse')
  }

  const allowedFields = ['title', 'description', 'category', 'date', 'location', 'capacity', 'price']

  for (const field of allowedFields) {
    if (changes[field] !== undefined) {
      if (field === 'date') {
        const newDate = new Date(changes[field])
        if (Number.isNaN(newDate.getTime())) {
          throw new Error('La fecha no es válida')
        }
        if (newDate <= new Date()) {
          throw new Error('La fecha del evento debe ser futura')
        }
        event[field] = newDate
      }
      else if (field === 'capacity') {
        if (Number(changes[field]) <= 0) {
          throw new Error('La capacidad debe ser mayor a cero')
        }
        event[field] = changes[field]
      }
      else if (field === 'price') {
        if (Number(changes[field] ?? 0) < 0) {
          throw new Error('El precio no puede ser negativo')
        }
        event[field] = changes[field]
      }
      else {
        event[field] = changes[field]
      }
    }
  }

  await event.save()

  return event
}
