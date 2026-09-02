import { Schema, model } from "mongoose";

const eventSchema = new Schema({
    name: String,
    date: Date,
    place: String,
    capacity: Number,
    price: Number,
    status: Boolean
});

export const eventModel = model("Events", eventSchema);