import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
    mongoose.connect(env.MONGO_URI);
}