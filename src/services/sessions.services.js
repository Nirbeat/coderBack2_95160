import { userModel } from "../models/userModel.js"
import { hashPassword, verifyPassword } from "../utils/hash.js"

export async function registerUser(userData) {

    const { first_name, last_name, email, password } = userData

    //Validamos campos requeridos
    if (!first_name || !last_name || !email || !password) {
        throw new Error("Faltan campos obligatorios")
    }

    //Validar formato email
    // REGEX regular expresions
    // texto-sin-arroba-ni-espacios + @ + texto-sin-arroba-ni-espacios + . + texto-sin-arroba-ni-espacios
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {
        throw new Error("Formato de email inválido");
    }

    //Validamos largo password minimo 6 caracteres
    if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    //Validar email repetido
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        throw new Error("El email ya está registrado");
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await userModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: "user"
    })

    //Responder al controller
    const userResponse = newUser.toObject()
    delete userResponse.password

    return userResponse
}

export async function loginUser(userData) {
    const { email, password } = userData;

    const user = await userModel.findOne({ email });
    if (user == null) throw new Error("Credenciales inválidas");

    if (!(await verifyPassword(password, user.password))) throw new Error("Credenciales inválidas password");

    return user;
}