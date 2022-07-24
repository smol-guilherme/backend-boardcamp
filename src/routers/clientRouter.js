import { Router } from "express";
import { createCustomers, editCustomers, getCustomers } from "../controllers/customerControllers.js";

const clientRouter = Router();

clientRouter.get("/", getCustomers)
clientRouter.put("/:clientId", editCustomers)
clientRouter.post("/", createCustomers)

export default clientRouter;