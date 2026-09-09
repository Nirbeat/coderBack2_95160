# Clase 2: Usuarios, Registro y Seguridad Inicial

Backend API para gestión de usuarios con sistema de registro seguro, hasheo de contraseñas y validación de datos.

## 🚀 Tecnologías

- **Node.js** - Runtime environment
- **Express** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Librería para hasheo de contraseñas
- **dotenv** - Gestión de variables de entorno

## 📁 Estructura del Proyecto

```
Plataforma_Eventos_Inscripciones_Backend_II_95160/
├── src/
│   ├── app.js                    # Punto de entrada y configuración de Express
│   ├── config/
│   │   ├── db.js                 # Conexión a MongoDB
│   │   └── env.js                # Configuración de variables de entorno
│   ├── controllers/
│   │   ├── sessions.controller.js # Controlador de registro/login
│   │   ├── user.controller.js    # Controlador de usuarios
│   │   └── ...
│   ├── models/
│   │   └── userModel.js           # Esquema de usuario con Mongoose
│   ├── routes/
│   │   ├── sessions.router.js     # Rutas de autenticación
│   │   ├── user.router.js         # Rutas de usuarios
│   │   └── ...
│   ├── services/
│   │   └── sessions.services.js  # Lógica de negocio de registro
│   └── utils/
│       ├── hash.js               # Funciones de hasheo de contraseñas
│       └── path.js               # Utilidades de rutas
├── .env.example                  # Plantilla de variables de entorno
├── package.json                  # Dependencias del proyecto
└── README.md                     # Este archivo
```

## 🔐 Seguridad y Hasheo de Contraseñas

### bcryptjs
El proyecto utiliza `bcryptjs` para el hasheo seguro de contraseñas. Esta librería implementa el algoritmo bcrypt que:

- Genera un salt aleatorio para cada contraseña
- Aplica múltiples rondas de hasheo (10 rondas configuradas)
- Es resistente a ataques de fuerza bruta y rainbow tables

### Implementación en `src/utils/hash.js`

```javascript
import bcrypt from "bcryptjs"

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}
```

## 📊 Modelo de Usuario

### Esquema en `src/models/userModel.js`

```javascript
const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'organizer'],
        default: 'user'
    }
})
```

**Campos del esquema:**
- `first_name`: Nombre del usuario (requerido)
- `last_name`: Apellido del usuario (requerido)
- `email`: Email único del usuario (requerido)
- `password`: Contraseña hasheada del usuario (requerido)
- `role`: Rol del usuario (por defecto: 'user')

## 🔄 Flujo de Registro de Usuarios

### 1. Middleware Express.json() en `src/app.js`

```javascript
app.use(express.json());
```

**¿Qué hace este middleware?**

Cuando un cliente envía datos al servidor (como en el registro de usuario), los datos viajan en formato JSON dentro del cuerpo de la solicitud HTTP. Por defecto, Express no sabe cómo leer estos datos.

`express.json()` es un middleware que:
- **Lee** el cuerpo de la solicitud HTTP
- **Convierte** el JSON recibido en un objeto JavaScript
- **Guarda** ese objeto en `req.body` para que puedas usarlo en tu código

**Ejemplo práctico:**

Sin el middleware:
```javascript
// req.body es undefined
console.log(req.body); // undefined
```

Con el middleware:
```javascript
// req.body contiene los datos enviados
console.log(req.body); 
// { first_name: "Juan", last_name: "Pérez", email: "juan@test.com", password: "123456" }
```

**Importante:** Este middleware debe configurarse antes de las rutas para que funcione correctamente en todas las solicitudes.

### 2. Ruta de Registro en `src/routes/sessions.router.js`

```javascript
router.post("/register", registerController);
```

**Endpoint:** `POST /api/sessions/register`

### 3. Controlador en `src/controllers/sessions.controller.js`

```javascript
export async function registerController(req, res) {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            status: 'success',
            payload: user
        })
    } catch (error) {
        // Manejo de errores específicos
    }
}
```

### 4. Servicio de Registro en `src/services/sessions.services.js`

El servicio implementa la lógica de negocio con las siguientes validaciones:

**Validaciones implementadas:**
1. **Campos obligatorios**: Verifica que `first_name`, `last_name`, `email` y `password` estén presentes
2. **Formato de email**: Usa regex para validar el formato del email
3. **Longitud de contraseña**: Mínimo 6 caracteres
4. **Email único**: Verifica que el email no esté registrado previamente
5. **Hasheo de contraseña**: Aplica bcrypt antes de guardar en BD

```javascript
export async function registerUser(userData) {
    const { first_name, last_name, email, password } = userData

    // Validación de campos requeridos
    if (!first_name || !last_name || !email || !password) {
        throw new Error("Faltan campos obligatorios")
    }

    // Validación de formato de email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Formato de email inválido");
    }

    // Validación de longitud de contraseña
    if(password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Verificación de email único
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        throw new Error("El email ya está registrado");
    }

    // Hasheo de contraseña
    const hashedPassword = await hashPassword(password)

    // Creación de usuario
    const newUser = await userModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: "user"
    })

    // Respuesta sin incluir la contraseña
    const userResponse = newUser.toObject()
    delete userResponse.password

    return userResponse
}
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` basado en `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/coderBack2
```

### 3. Ejecutar el servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

## 📡 Endpoints Disponibles

### Registro de Usuario
- **POST** `/api/sessions/register`
- **Body:**
  ```json
  {
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }
  ```
- **Response (201):**
  ```json
  {
    "status": "success",
    "payload": {
      "_id": "...",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com",
      "role": "user",
      "__v": 0
    }
  }
  ```

### Errores de Registro
- **400** - Campos faltantes, email inválido o contraseña muy corta
- **409** - Email ya registrado
- **500** - Error interno del servidor

### Otros Endpoints
- **GET** `/api/users` - Obtener todos los usuarios
- **GET** `/api/users/:email` - Obtener usuario por email
- **PUT** `/api/users/:email` - Actualizar usuario
- **GET** `/` - Root endpoint

## 🔑 Puntos Clave de Seguridad

1. **Hasheo de contraseñas**: Nunca se almacenan contraseñas en texto plano
2. **Salt único**: Cada contraseña tiene su propio salt generado aleatoriamente
3. **Validación de email**: Regex para prevenir emails inválidos
4. **Email único**: Índice unique en MongoDB para prevenir duplicados
5. **Respuesta segura**: La contraseña nunca se incluye en la respuesta al cliente
6. **Middleware express.json()**: Permite recibir correctamente los datos JSON en `req.body`

## 📝 Notas Importantes

- El modelo de usuario incluye el campo `password` en el esquema para almacenar la contraseña hasheada
- El middleware `express.json()` debe configurarse antes de las rutas para asegurar que todas las solicitudes puedan parsear el body correctamente
- Las validaciones se realizan en la capa de servicios para mantener la separación de responsabilidades
