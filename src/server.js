import express, { json } from "express";
import cors from "cors"
import "dotenv/config"

const app = express();

const PORT = process.env.PORT

app.use(cors())
app.use(json())

app.listen(PORT || 5001, () => console.log(`Server listening to PORT ${PORT} @${Date().toString()}`));