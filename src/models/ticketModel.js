import { Schema, model, Types } from "mongoose";

const ticketSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "Users"
    },
    event: {
        type: Types.ObjectId,
        ref: "Events"
    }
});

export const ticketModel = model("Tickets", ticketSchema); 