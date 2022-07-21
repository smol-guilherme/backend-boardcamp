import { Router } from "express";

const clientRouter = Router();

clientRouter.get("/clients")
clientRouter.put("/clients")
clientRouter.post("/clients")

export default clientRouter;