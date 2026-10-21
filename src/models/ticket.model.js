import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema({

     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
     },
     event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
     },
     status: {
        type: String,
        enum:["active", "cancelled"],
       default: "active"
     },
     quantity: {
        type: Number,
        default: 1,
        min: 1
     },
     code: {
        type: String,
        unique: true
     },
     cancelledAt: {
        type: Date,
        default: null        
     }
      
},
{
      timestamp: true
}

)
      
export const ticketModel = mongoose.model("Ticket", ticketSchema)