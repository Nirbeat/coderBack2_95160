import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const eventSchema = new mongoose.Schema({
    title: {type: String,  required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    date: {type: Date, required: true},
    location: {type: String, required: true},
    capacity: {type: Number, required: true, min: 1},
    price: {type: Number, required: true, min: 0},
    status: {
        type: String,
        enum: ["draft", "published", "cancelled", "finished"],
        default: "draft"
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
},
{
    timestamps: true
}
)

// La siguiente línea de código habilita el plugin de paginación de mongoose-paginate-v2
// en el schema de eventos
eventSchema.plugin(mongoosePaginate)

export const eventModel = mongoose.model("Events", eventSchema)




// GET /api/events/published + controller + services + repository + dao + MongoDB
// GET /api/events/cancelled + controller + services + repository + dao + MongoDB
// GET /api/events/buenos-aires + controller + services + repository + dao + MongoDB
// GET /api/events/backend + controller + services + repository + dao + MongoDB
// GET /api/events/backend + controller + services + repository + dao + MongoDB

// GET /api/events/?page=10 + controller + services + repository + dao + MongoDB
// GET /api/events/?sort=date + controller + services + repository + dao + MongoDB