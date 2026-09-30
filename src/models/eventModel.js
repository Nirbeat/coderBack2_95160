import { Schema, model, Types } from "mongoose";

const eventSchema = new Schema({
    name: String,
    date: Date,
    place: String,
    capacity: Number,
    price: Number,
    status: Boolean,
    organizer: {
        type: Types.ObjectId,
        ref: "Users"
    }
});

export const eventModel = model("Events", eventSchema);