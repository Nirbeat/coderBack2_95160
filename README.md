# Curso de Programación Backend II - Clase 4: Passport y estrategias avanzadas

Backend API para gestión de usuarios con sistema de autenticación utilizando Passport, estrategias Local y JWT, cookies firmadas y gestión de sesiones.

## 🚀 Tecnologías

- **Node.js** - Runtime environment
- **Express** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Librería para hasheo de contraseñas
- **passport** - Middleware de autenticación
- **passport-local** - Estrategia de autenticación con username/password
- **passport-jwt** - Estrategia de autenticación con JWT
- **jsonwebtoken** - Generación y verificación de tokens JWT
- **cookie-parser** - Middleware para parsear cookies
- **dotenv** - Gestión de variables de entorno

## 📁 Estructura del Proyecto

```
coderBack2_95160_BASE_PARA_TRABAJAR_DURANTE_LA_CLASE/
├── src/
│   ├── app.js                    # Punto de entrada y configuración de Express
│   ├── config/
│   │   ├── db.js                 # Conexión a MongoDB
│   │   ├── env.js                # Configuración de variables de entorno
│   │   └── passport.config.js    # Configuración de estrategias Passport
│   ├── controllers/
│   │   ├── sessions.controller.js # Controlador de sesiones (register, login, current, logout)
│   │   └── ...
│   ├── models/
│   │   └── userModel.js           # Esquema de usuario con Mongoose
│   ├── routes/
│   │   ├── sessions.router.js     # Rutas de autenticación
│   │   └── ...
│   ├── services/
│   │   └── sessions.services.js  # Lógica de negocio de sesiones
│   └── utils/
│       ├── hash.js               # Funciones de hasheo de contraseñas
│       └── jwt.js                # Funciones de generación y verificación JWT
├── .env.example                  # Plantilla de variables de entorno
├── package.json                  # Dependencias del proyecto
└── README.md                     # Este archivo
```

## 🔐 Configuración de Passport

### Estrategias Implementadas

El proyecto implementa tres estrategias de Passport:

1. **register**: Registro de nuevos usuarios
2. **login**: Autenticación de usuarios existentes
3. **current**: Verificación de token JWT para obtener usuario actual

### Configuración en `src/config/passport.config.js`

#### Estrategia Register
- Valida campos obligatorios (first_name, last_name, email, password)
- Verifica que el email no exista previamente
- Hashea la contraseña antes de guardar
- Devuelve el usuario creado en `req.user`

#### Estrategia Login
- Busca usuario por email
- Verifica la contraseña usando bcrypt
- Devuelve el usuario autenticado en `req.user`

#### Estrategia Current (JWT)
- Extrae el token de la cookie firmada
- Verifica el token usando la clave secreta
- Busca el usuario en la base de datos usando el ID del token
- Devuelve el usuario en `req.user`

## 📡 Endpoints Disponibles (a testear con Postman)

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
    "message": "Usuario registrado exitosamente",
    "payload": {
      "id": "...",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com",
      "role": "user"
    }
  }
  ```

### Login de Usuario
- **POST** `/api/sessions/login`
- **Body:**
  ```json
  {
    "email": "juan@example.com",
    "password": "password123"
  }
  ```
- **Response (200):**
  ```json
  {
    "status": "success",
    "message": "Login correcto"
  }
  ```
- **Cookie:** Se establece una cookie firmada con el token JWT

### Usuario Actual
- **GET** `/api/sessions/current`
- **Headers:** Cookie con el token JWT
- **Response (200):**
  ```json
  {
    "status": "success",
    "payload": {
      "id": "...",
      "email": "juan@example.com",
      "role": "user"
    }
  }
  ```
- **Propósito:** Obtener los datos del usuario autenticado actual mediante el token JWT almacenado en la cookie

### Logout
- **DELETE** `/api/sessions/logout`
- **Response (200):**
  ```json
  {
    "status": "success",
    "message": "Logout correcto"
  }
  ```
- **Acción:** Elimina la cookie que contiene el token

## 🔑 Configuración Importante en el Router

En `src/routes/sessions.router.js`, es necesario agregar `{ session: false }` en las rutas que usan Passport:

```javascript
router.post("/register", passport.authenticate("register", { session: false }), registerController);
router.post("/login", passport.authenticate("login", { session: false }), loginController);
router.get("/current", passport.authenticate("current", { session: false }), currentController);
```

**¿Por qué `{ session: false }`?**
- Deshabilita el manejo de sesiones por defecto de Passport
- Permite usar JWT en lugar de sesiones tradicionales
- Es obligatorio cuando se usan cookies con tokens JWT

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
JWT_SECRET=tu_clave_secreta_aqui
COOKIE_SECRET=tu_secreto_para_cookies_aqui
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

## 🔐 Flujo de Autenticación con JWT

### 1. Registro
- Usuario envía datos de registro
- Passport valida y crea el usuario
- Se devuelve respuesta con datos del usuario (sin contraseña)

### 2. Login
- Usuario envía email y contraseña
- Passport verifica credenciales
- Se genera un token JWT con datos esenciales (id, email, role)
- Se establece una cookie firmada con el token
- Cookie se envía al cliente con configuración segura (httpOnly, signed)

### 3. Acceso a Rutas Protegidas (/current)
- Cliente envía cookie con el token
- Passport-JWT extrae el token de la cookie
- Verifica el token con la clave secreta
- Busca usuario en BD con el ID del token
- Datos del usuario disponibles en `req.user`

## 📝 Implementación de passport-jwt para la ruta /current

### ¿Por qué se necesita passport-jwt?
Para la ruta `/current` Passport necesita una estrategia específica llamada  "passport-jwt" (la cual debe er instalada) la cual permite verificar el token JWT que se envía en la cookie. Esto habilita un sistema de autenticación donde el token contiene toda la información necesaria para validar la identidad del usuario.

### Paso a paso de la implementación:

#### 1. Instalación de la librería
```bash
npm install passport-jwt
```

#### 2. Configuración en `src/config/passport.config.js`

**Importación:**
```javascript
import { Strategy as JwtStrategy } from "passport-jwt"
```

**Función cookieExtractor:**
```javascript
const cookieExtractor = req => {
    let token = null
    if(req && req.cookies) token = req.signedCookies.Este_es_el_nombre_de_la_cookie
    return token
}
```
Esta función extrae el token de la cookie firmada de la solicitud.

**Configuración de la estrategia:**
```javascript
passport.use("current", new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, done) => {
    try {
        const user = await userModel.findById(jwtPayload.id)
        if(!user) {
            return done(null, false, {message: "Usuario no encontrado"})
        }
        return done(null, user)
    } catch (error) {
        return done(error)
    }
}))
```
- `jwtFromRequest`: Define cómo extraer el token (desde cookie)
- `secretOrKey`: Clave secreta para verificar la firma del token
- Callback: Busca usuario en BD y lo devuelve en `req.user`

#### 3. Router en `src/routes/sessions.router.js`

```javascript
router.get("/current", passport.authenticate("current", { session: false }), currentController);
```
La ruta usa la estrategia "current" de Passport para autenticar la solicitud.

#### 4. Controller en `src/controllers/sessions.controller.js`

```javascript
export async function currentController(req, res) {
    res.status(200).json({
        status: "success",
        payload: {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role
        }
    })
}
```
El controller accede a `req.user` que es poblado por Passport-JWT.

#### 5. Configuración en `src/app.js`

```javascript
import passport from "passport"
import "./config/passport.config.js"
app.use(passport.initialize())
```
- Importa Passport
- Importa la configuración de estrategias
- Inicializa Passport en la aplicación

## 🗑️ Eliminación de sessions.middleware.js

Se prescindió del archivo `sessions.middleware.js` que verificaba la existencia de una cookie. Esta funcionalidad ahora es manejada directamente por la estrategia passport-jwt, que extrae y valida el token de la cookie de forma más robusta y segura. El archivo fue eliminado para simplificar la arquitectura y evitar duplicación de lógica.

## 🔑 Puntos Clave de Seguridad

1. **Hasheo de contraseñas**: Nunca se almacenan contraseñas en texto plano
2. **JWT en cookies**: Token almacenado en cookie firmada con httpOnly
3. **Verificación de token**: passport-jwt valida cada solicitud a /current
4. **Session false**: Deshabilitado manejo de sesiones tradicionales
5. **Cookie firmada**: Protección contra manipulación de cookies
6. **Clave secreta**: JWT_SECRET en .env para firmar tokens

## 📝 Notas Importantes

- Las estrategias register y login funcionan con cookies y JWT
- La ruta /current requiere passport-jwt para validar el token
- El middleware sessions.middleware.js fue eliminado en favor de passport-jwt
- Todas las rutas con Passport deben incluir `{ session: false }`
