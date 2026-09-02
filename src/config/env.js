import { config } from "dotenv";
config();

export const env = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI
}