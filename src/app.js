import express from "express";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/user.router.js";
import eventRouter from "./routes/event.router.js";
import ticketRouter from "./routes/ticket.router.js";
import rootRouter from "./routes/root.router.js";
import sessionRouter from "./routes/sessions.router.js";

const app = express();

app.use(express.json());

app.use("/", rootRouter);
app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/sessions", sessionRouter);


app.listen(process.env.PORT, () => {
    console.log("server andando en el puerto " + process.env.PORT);
    connectDB()
        .then(() => console.log("conectado a DB"))
        .catch(e => console.log(e));
});
