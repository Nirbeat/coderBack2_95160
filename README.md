# Curso de Programación Backend II - Clase 6

## Entidad Eventos y Lógica de Negocios

En esta clase se implementó la entidad `Event` con su modelo, consultas avanzadas y reglas de negocio.

---

## Modelo Event

Se creó el modelo `Event` en `src/models/event.model.js` con las siguientes propiedades:

- **title**: String (requerido) - Título del evento
- **description**: String (requerido) - Descripción del evento
- **category**: String (requerido) - Categoría del evento
- **date**: Date (requerido) - Fecha del evento
- **location**: String (requerido) - Ubicación del evento
- **capacity**: Number (requerido, min: 1) - Capacidad máxima del evento
- **price**: Number (requerido, min: 0) - Precio del evento
- **status**: String (enum: "draft", "published", "cancelled", "finished", default: "draft") - Estado del evento
- **organizer**: ObjectId (ref: "Users", requerido) - Usuario organizador del evento
- **timestamps**: createdAt y updatedAt automáticos

El schema incluye validaciones de Mongoose para asegurar la integridad de los datos (capacidad mínima 1, precio no negativo, estados válidos).

### Plugin de Paginación

Se integró el plugin `mongoose-paginate-v2` en el schema para habilitar la paginación nativa en las consultas.

---

## Consultas, Filtros, Paginación y Ordenamiento

Se implementó la función `eventsService` en `src/services/events.services.js` que permite:

### Filtros Dinámicos
- **status**: Filtrar eventos por estado (draft, published, cancelled, finished)
- **category**: Filtrar eventos por categoría
- **location**: Filtrar eventos por ubicación

### Paginación
- **page**: Número de página (comienza en 1, default: 1)
- **limit**: Cantidad de resultados por página (default: 10)
- Retorna metadatos: `docs`, `totalDocs`, `totalPages`, `page`, `limit`, etc.

### Ordenamiento
- **sort**: Campo por el cual se ordenan los resultados (default: 'date')

### Populate
- Se popula el campo `organizer` con los datos del usuario
- Se seleccionan solo los campos: `first_name`, `last_name`, `email`

### Ejemplos de Uso

```
GET /api/events?page=1&limit=10
GET /api/events?status=published
GET /api/events?category=conferencia&location=buenos-aires
GET /api/events?sort=date
GET /api/events?page=2&limit=5&status=published&sort=price
```

---

## Reglas de Negocio

Las reglas de negocio se implementaron principalmente en `src/services/events.services.js`:

### Control de Permisos

Función interna `canManageEvent`:
- Los usuarios con rol `admin` pueden administrar cualquier evento
- Los organizadores solo pueden administrar sus propios eventos
- Se comparan los IDs como strings para evitar errores de referencia de objetos

### Crear Evento (`createEvent`)

Validaciones implementadas:
1. **Autenticación**: Verifica que exista un usuario autenticado para asignar la propiedad del evento
2. **Fecha futura**: La fecha del evento debe ser posterior a la fecha actual
3. **Capacidad positiva**: La capacidad debe ser mayor a cero
4. **Precio no negativo**: El precio no puede ser negativo (0 para eventos gratuitos)
5. **Propiedad segura**: El `organizer` se asigna desde `req.user._id`, no del body del cliente
6. **Estado inicial**: Los eventos se crean con estado `draft` por defecto

### Actualizar Evento (`updateEvent`)

Validaciones implementadas:
1. **Existencia**: Verifica que el evento exista en la base de datos
2. **Permisos**: Verifica que el usuario tenga permiso para modificar (propietario o admin)
3. **Estado cancelado**: Los eventos cancelados no pueden modificarse (estado final)
4. **Campos permitidos**: Solo se permite modificar: `title`, `description`, `category`, `date`, `location`, `capacity`, `price`
5. **Protección de campos**: No se permite modificar `organizer` ni `status` directamente
6. **Validaciones en actualización**:
   - Si se modifica la fecha, debe seguir siendo futura
   - Si se modifica la capacidad, debe ser mayor a cero
   - Si se modifica el precio, no puede ser negativo

---

## Arquitectura

Se mantuvo la arquitectura en capas sin agregar capas adicionales (repository, dao, etc.):

```
Route → Controller → Service → Model (Mongoose) → MongoDB
```

### Archivos Principales

- **`src/models/event.model.js`**: Definición del schema de Event con plugin de paginación
- **`src/services/events.services.js`**: Lógica de negocio, consultas, filtros y validaciones
- **`src/controllers/event.controller.js`**: Manejo de peticiones HTTP y respuestas
- **`src/routes/event.router.js`**: Definición de rutas con middleware de autenticación y roles

---

## Comentarios en el Código

Recuerden que el código contiene comentarios explicativos y que en cada sección importante se suelen detallar:
- Propósito de cada función
- Validaciones realizadas
- Razones de las reglas de negocio
- Explicación de parámetros y configuraciones


---

## Algunas notas complementarias

- La propiedad del recurso se controla desde el backend usando `req.user`, no desde el body
- Los estados `cancelled` y `finished` son estados finales que no admiten transiciones
- La paginación usa `mongoose-paginate-v2` para simplificar la implementación
- Todas las validaciones de negocio están en el service layer
- El controller se limita a manejar HTTP y delegar la lógica al service