import { eventModel } from '../models/event.model.js'

// La siguiente función interna verifica si un usuario tiene permiso para administrar un evento
const canManageEvent = (event, user) => {
  if (user.role === 'admin') return true //El admin puede administrar cualquier evento
  return event.organizer.toString() === user._id.toString() //Los organizadores solo los propios
}

export const eventsService = async (query = {}) => {
  // Extraemos los parámetros de filtro de la query string
  // para permitir filtrar eventos por estado, categoría y ubicación
  const status = query.status
  const category = query.category
  const location = query.location
  
  // Configuramos la paginación con valores por defecto
  // page: número de página (comienza en 1), limit: cantidad de resultados por página
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  
  // Configuramos el ordenamiento de resultados por defecto
  // sort: campo por el cual se ordenan los resultados (por defecto por fecha)
  const sort = query.sort || 'date'

  // El siguiente objeto construye los filtros dinámicamente según los parámetros recibidos
  // Solo se agregan filtros si el parámetro correspondiente está presente
  const filter = {}
  if (status) filter.status = status
  if (category) filter.category = category
  if (location) filter.location = location

  // Configuramos las opciones de paginación mongoose-paginate-v2
  const options = {
    page,
    limit,
    sort,
    populate: {
      path: 'organizer',
      select: 'first_name last_name email'
    }
  }

  // La siguiente línea ejecuta la consulta paginada con filtros y ordenamiento
  // Devuelve un objeto con docs, totalDocs, totalPages, page, limit, etc.
  const result = await eventModel.paginate(filter, options)

  return result
}


// Reglas de negocio para crear un evento


// Regla de negocio para crear un evento, valida fecha futura, capacidad positiva y precio no negativo
export const createEvent = async (eventData, authenticatedUser) => {

  // La siguiente línea verifica que exista un usuario autenticado
  // para asignar la propiedad del evento de forma segura
  if (!authenticatedUser?._id) {
    throw new Error('Usuario no autenticado')
  }

  // Primero convertimos la fecha recibida a objeto Date
  const eventDate = new Date(eventData.date)
  // Para luego validar que la fecha del evento sea futura
  // Crear un evento con fecha pasada no tiene sentido
  if (eventDate <= new Date()) {
    throw new Error('La fecha del evento debe ser futura')
  }

  // Validamos que la capacidad sea mayor a cero
  // Un evento sin capacidad no puede recibir participantes
  if (Number(eventData.capacity) <= 0) {
    throw new Error('La capacidad debe ser mayor a cero')
  }

  // Validamos que el precio no sea negativo
  if (Number(eventData.price ?? 0) < 0) { // ?? utiliza 0 solamente si price es null o undefined
    throw new Error('El precio no puede ser negativo')
  }


  // En el siguiente objeto construimos la estructura del evento a crear
  const eventToCreate = {
    ...eventData,
    date: eventDate,
    organizer: authenticatedUser._id,
    status: 'draft'
  }

  // Acá efectívamente creamos el evento en MongoDB
  return eventModel.create(eventToCreate)
}



// Esta función implementa la regla de negocio para actualizar un evento
// Verifica propiedad, estado y aplica solo campos permitidos
export const updateEvent = async (eventId, changes, authenticatedUser) => {
  // La siguiente línea carga el evento desde la base de datos
  // Necesario para verificar propiedad y estado antes de modificar
  const event = await eventModel.findById(eventId)

  // La siguiente línea verifica que el evento exista
  if (!event) {
    throw new Error('Evento no encontrado')
  }

  // La siguiente línea verifica que el usuario tenga permiso para modificar
  // usando la función interna canManageEvent
  if (!canManageEvent(event, authenticatedUser)) {
    throw new Error('No podés modificar este evento')
  }

  // La siguiente línea impide modificar eventos cancelados
  // Un evento cancelado es un estado final que no admite cambios
  if (event.status === 'cancelled') {
    throw new Error('Un evento cancelado no puede modificarse')
  }

  // La siguiente línea define los campos que pueden modificarse
  // Esto evita que el cliente modifique organizer o status directamente
  const allowedFields = ['title', 'description', 'category', 'date', 'location', 'capacity', 'price']
  
  // El siguiente bucle aplica solo los campos permitidos
  // Si el campo no está en la lista, se ignora
  for (const field of allowedFields) {
    if (changes[field] !== undefined) {
      // La siguiente línea valida la fecha si se está modificando
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
      // La siguiente línea valida la capacidad si se está modificando
      else if (field === 'capacity') {
        if (Number(changes[field]) <= 0) {
          throw new Error('La capacidad debe ser mayor a cero')
        }
        event[field] = changes[field]
      }
      // La siguiente línea valida el precio si se está modificando
      else if (field === 'price') {
        if (Number(changes[field] ?? 0) < 0) {
          throw new Error('El precio no puede ser negativo')
        }
        event[field] = changes[field]
      }
      // Los demás campos permitidos se asignan directamente
      else {
        event[field] = changes[field]
      }
    }
  }

  // La siguiente línea guarda los cambios en MongoDB
  // Mongoose ejecuta las validaciones del schema antes de persistir
  await event.save()

  return event
}
