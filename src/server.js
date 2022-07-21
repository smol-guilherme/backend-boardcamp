import express, { json } from "express";
import cors from "cors"
import serviceRouter from "./routers/serviceRouter.js";
import clientRouter from "./routers/clientRouter.js";
import rentRouter from "./routers/rentRouter.js";
import pathHandlerMiddleware from "./middlewares/requisitionHandler.js";
import validateEntry from "./middlewares/validateData.js";
import "dotenv/config"

const app = express();

const PORT = process.env.PORT

app.use(cors())
app.use(json())
app.use(pathHandlerMiddleware);
app.use(validateEntry);
app.use(serviceRouter)
app.use(clientRouter)
app.use(rentRouter)

app.listen(PORT || 4001, () => console.log(`Server listening to PORT ${PORT} @${Date().toString()}`));