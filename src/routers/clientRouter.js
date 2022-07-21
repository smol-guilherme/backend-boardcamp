import { Router } from "express";

const clientRouter = Router();

clientRouter.get("/customers")
clientRouter.put("/customers")
clientRouter.post("/customers")

export default clientRouter;