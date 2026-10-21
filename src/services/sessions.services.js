import mongoUserDao from "../dao/mongodb/user.dao.js";
// import postgreUserDao from "../dao/postgresql/user.dao.js";
import UserRepository from "../repository/user.repository.js";
// import userDao from "../dao/postgresql/user.dao.js";
import { hashPassword, verifyPassword } from "../utils/hash.js"

const userRepository = new UserRepository(mongoUserDao);

export async function registerUser(userData) {

    const { first_name, last_name, email, password } = userData

    if (!first_name || !last_name || !email || !password) {
        throw new Error("Faltan campos obligatorios")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new Error("Formato de email inválido");
    }

    if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    const existingUser = await userRepository.findByEmail(email)

    if (existingUser) {
        throw new Error("El email ya está registrado");
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await userDao.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: "user"
    })

    const userResponse = newUser.toObject()
    delete userResponse.password

    return userResponse
}

export async function loginUser(userData) {
    // try {
    const { email, password } = userData;

    const user = await userRepository.findByEmail(email);
    if (user == null) throw new Error("Credenciales inválidas");

    if (!(await verifyPassword(password, user.password))) throw new Error("Credenciales inválidas password");

    return user;
    // } catch (error) {
    //     await new UserRepository(postgreUserDao).findByEmail(email)
    // }
}