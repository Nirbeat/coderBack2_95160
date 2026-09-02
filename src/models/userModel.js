import { Schema, model } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
});

export const userModel = model("Users", userSchema);