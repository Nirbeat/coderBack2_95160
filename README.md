# Curso de Programación Backend II - Clase 7

## Tickets, Inscripciones y Relaciones Prolijas

En esta clase se implementó la entidad `Ticket` para gestionar las inscripciones de usuarios a eventos, con relaciones prolijas entre las entidades y lógica de negocio robusta para el control de capacidad y validaciones de inscripciones.

---

## Modelo Ticket

Se creó el modelo `Ticket` en `src/models/ticket.model.js` con las siguientes propiedades:

- **user**: ObjectId (ref: "User", requerido) - Usuario que posee el ticket
- **event**: ObjectId (ref: "Event", requerido) - Evento al que está asociado el ticket
- **status**: String (enum: "active", "cancelled", default: "active") - Estado del ticket
- **quantity**: Number (default: 1, min: 1) - Cantidad de entradas reservadas
- **code**: String (unique) - Código único del ticket (para identificación)
- **cancelledAt**: Date (default: null) - Fecha de cancelación del ticket
- **timestamps**: createdAt y updatedAt automáticos

El schema incluye validaciones de Mongoose para asegurar la integridad de los datos (cantidad mínima 1, estados válidos, código único).

### Relaciones

El modelo establece relaciones prolijas con:
- **User**: Referencia al usuario que compra el ticket
- **Event**: Referencia al evento al que se inscribe el usuario

---

## Lógica de Negocio en el Controller de Tickets

La lógica de negocio principal se implementó en `src/controllers/ticket.controller.js` en la función `createTicket`:

### Validaciones Implementadas

1. **Existencia del evento**: Verifica que el evento exista en la base de datos
2. **Estado del evento**: El evento debe estar publicado (status: "published")
3. **Fecha del evento**: El evento no debe haber pasado (date > fecha actual)
4. **Ticket único por usuario**: Un usuario no puede tener más de un ticket activo para el mismo evento
5. **Control de capacidad**: Verifica que haya suficientes entradas disponibles antes de crear el ticket

### Cálculo de Capacidad Disponible

Se utiliza una operación de agregación de MongoDB para calcular las entradas reservadas:

```javascript
const result = await ticketModel.aggregate([
    {$match: {event: event._id, status: "active"}},
    {$group: {_id: "$event", totalReserved: {$sum: "$quantity"}}}
])
```

- Filtra tickets activos para el evento específico
- Agrupa por evento y suma las cantidades de todos los tickets activos
- Calcula la disponibilidad: `available = event.capacity - reserved`
- Valida que la cantidad solicitada no supere la disponibilidad

### Creación del Ticket

Si todas las validaciones pasan:
- Se crea el ticket con el usuario autenticado (`req.user._id`)
- Se asigna el evento y la cantidad solicitada
- El estado por defecto es "active"
- El código único se genera automáticamente (pendiente de implementación)

---

## Rutas de Tickets

Las rutas se definen en `src/routes/ticket.router.js`:

### Middleware de Autenticación
- Todas las rutas requieren autenticación mediante Passport JWT
- Se usa `passport.authenticate("current", { session: false })`

### Rutas Disponibles

```
POST /api/tickets
```

- **Roles permitidos**: user, organizer, admin
- **Body esperado**: `{ eventId, quantity }`
- **Respuesta exitosa**: 201 con el ticket creado
- **Errores**: 400 para validaciones fallidas, 404 para evento no encontrado, 500 para errores del servidor

---

## Modelos Relacionados

### Modelo User

Definido en `src/models/user.model.js`:

- **first_name**: String (requerido)
- **last_name**: String (requerido)
- **email**: String (requerido, unique)
- **password**: String (requerido)
- **role**: String (enum: "user", "admin", "organizer", default: "user")

### Modelo Event

Definido en `src/models/event.model.js`:

- **title**: String (requerido)
- **description**: String (requerido)
- **category**: String (requerido)
- **date**: Date (requerido)
- **location**: String (requerido)
- **capacity**: Number (requerido, min: 1)
- **price**: Number (requerido, min: 0)
- **status**: String (enum: "draft", "published", "cancelled", "finished", default: "draft")
- **organizer**: ObjectId (ref: "Users", requerido)
- **timestamps**: createdAt y updatedAt automáticos
- **Plugin**: mongoose-paginate-v2 para paginación

---

## Arquitectura

Se mantiene la arquitectura en capas:

```
Route → Controller → Model (Mongoose) → MongoDB
```

### Archivos Principales

- **`src/models/ticket.model.js`**: Definición del schema de Ticket con relaciones
- **`src/controllers/ticket.controller.js`**: Lógica de negocio para creación de tickets y validaciones
- **`src/routes/ticket.router.js`**: Definición de rutas con middleware de autenticación y autorización
- **`src/models/user.model.js`**: Definición del schema de User
- **`src/models/event.model.js`**: Definición del schema de Event con paginación

---


## Comentarios en el Código

El código contiene comentarios explicativos que detallan:
- Propósito de cada validación
- Razones de las reglas de negocio
- Explicación de operaciones de agregación
- Manejo de errores y respuestas HTTP

---

## Notas Complementarias

- La propiedad del ticket se asigna desde `req.user._id`, no desde el body del cliente
- El control de capacidad se realiza en tiempo real usando agregación de MongoDB
- Los tickets cancelados no se cuentan en el cálculo de capacidad (status: "cancelled")
- Un usuario solo puede tener un ticket activo por evento (evita múltiples inscripciones)
- La lógica de negocio está centralizada en el controller para este caso particular
- Se usa Passport JWT para autenticación sin sesiones (stateless)