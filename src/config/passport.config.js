import passport from "passport"
import { Strategy as LocalStrategy} from "passport-local"
import { Strategy as JwtStrategy } from "passport-jwt"
import { userModel } from "../models/user.model.js"
import { hashPassword, verifyPassword } from "../utils/hash.js"


// Función para extraer el token de las cookies, queusará la estrategia current
const cookieExtractor = req => {
    
    let token = null
    if(req && req.cookies) token = req.signedCookies.Este_es_el_nombre_de_la_cookie
    return token
}



// Estrategia register: registra un nuevo usuario
passport.use("register", new LocalStrategy({usernameField: "email", passReqToCallback: true},
    async (req, email, password, done) => {

        try {
            const {first_name, last_name} = req.body

            if(!first_name || !last_name || !email || !password) {
               return done(null, false, {message: "Todos los campos son obligatorios"})
            }

            const normalizedEmail = email.toLowerCase().trim()
            const userExists = await userModel.findOne({email: normalizedEmail})

            if(userExists) {
                return done(null, false, {message: "El usuario ya existe"})
            }

            //hashear la contraseña
            const hashedPassword = await hashPassword(password)

            const newUser = await userModel.create({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                role: "user"
            })

            return done(null, newUser) 
            // Los datos del usuario quedarán disponibles en req.user

        } catch (error) {
            return done(error)
        }
    }
) )

// Estrategia login: autentica un usuario existente
passport.use("login", new LocalStrategy({usernameField: "email"}, 
    async (email, password, done) => {

        try {
          
            const normalizedEmail = email.toLowerCase().trim()

            const user = await userModel.findOne({email: normalizedEmail})

            if(!user) { 
                return done(null, false, {message: "Usuario no encontrado"})
            }

            const validPassword = verifyPassword(password, user.password)

            if(!validPassword) {
                return done(null, false, {message: "Contraseña incorrecta"})
            }
         
            return done(null, user) 
            // Los datos del usuario quedarán disponibles en req.user

        } catch (error) {
            
            return done(error)
        }
        
    }
))


// Estrategia current: verifica el token JWT enviado dentro de la cookie en la petición a /current
passport.use("current", new JwtStrategy({

     jwtFromRequest: cookieExtractor,       // cookieExtractor extrae el token de las cookies

     secretOrKey: process.env.JWT_SECRET    // clave secreta para verificar el token, que está guardada en el .env
}, 
// Passport extrae los datos del usuario del token y los guarde en jwtPayload
async (jwtPayload, done)=> {

    try {

        // Buscamos el usuario en la base de datos usando el id guadado en el token
        const user = await userModel.findById(jwtPayload.id) 

        // Si no se encuentra el usuario, retornamos false
        if(!user) {
            return done(null, false, {message: "Usuario no encontrado"})
        }

        // En el caso de que se encuentre el usuario, devolvemos el usuario encontrado
        return done(null, user) 
        // Los datos del usuario quedarán disponibles en req.user

    } catch (error) {
        return done(error)
    }
}))
