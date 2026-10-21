import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JwtStrategy } from "passport-jwt"
import { userModel } from "../models/user.model.js"
import { hashPassword, verifyPassword } from "../utils/hash.js"
import UserRepository from "../repository/user.repository.js"
import userDao from "../dao/mongodb/user.dao.js"
import { RegisterUserDTO, SessionUserDataDTO } from "../dto/user.dto.js"

const userRepository = new UserRepository(userDao);

const cookieExtractor = req => {
    let token = null
    if (req && req.cookies) token = req.signedCookies.Este_es_el_nombre_de_la_cookie
    return token
}

passport.use("register", new LocalStrategy({ usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
        try {
            const userData = new RegisterUserDTO(req.body);

            const userExists = await userRepository.findByEmail(userData.email)

            if (userExists) {
                return done(new Error("El usuario ya existe"), false, { message: "El usuario ya existe" })
            }

            const hashedPassword = await hashPassword(password);
            const newUser = await userRepository.create({ ...userData, password: hashedPassword })

            return done(null, newUser)
        } catch (error) {
            return done(error)
        }
    }
))

passport.use("login", new LocalStrategy({ usernameField: "email" },
    async (email, password, done) => {
        try {
            const normalizedEmail = email.toLowerCase().trim()

            const user = await userModel.findOne({ email: normalizedEmail })

            if (!user) {
                return done(null, false, { message: "Usuario no encontrado" })
            }

            const validPassword = verifyPassword(password, user.password)

            if (!validPassword) {
                return done(null, false, { message: "Contraseña incorrecta" })
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
))

passport.use("current", new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
},

    async (jwtPayload, done) => {
        try {
            const user = await userModel.findById(jwtPayload.id)

            if (!user) {
                return done(null, false, { message: "Usuario no encontrado" })
            }

            return done(null, new SessionUserDataDTO(user));
        } catch (error) {
            return done(error)
        }
    }))
