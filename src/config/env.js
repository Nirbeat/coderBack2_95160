import { config } from "dotenv";
config({ quiet: true });

export const env = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    JWT_SECRET: process.env.JWT_SECRET
}