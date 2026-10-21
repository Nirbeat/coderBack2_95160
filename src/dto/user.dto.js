export class RegisterUserDTO {
  constructor(userData) {
    const { first_name, last_name, email, password } = userData

    if (!first_name || !last_name || !email || !password) {
      throw new Error("Todos los campos son obligatorios")
    }

    const normalizedEmail = email.toLowerCase().trim()

    return {
      ...userData,
      email: normalizedEmail
    };
  }
}

export class SessionUserDataDTO {
  constructor(userData) {
    delete userData.password;

    return userData;
  }
}

console.log(new SessionUserDataDTO({
  "email": "RUTHSOSA@mail.com",
  "password": "contraseñapoderosa",
  "first_name": "Ruth",
  "last_name": "Sosa"
}));
