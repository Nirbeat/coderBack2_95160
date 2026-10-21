import { Schema, model } from "mongoose"
import { hashPassword } from "../utils/hash.js"

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

export const userModel = model('Users', userSchema)