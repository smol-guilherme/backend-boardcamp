import { Router } from "express";
import { createCustomers, editCustomers, getCustomers } from "../controllers/customerControllers.js";

const clientRouter = Router();

clientRouter.get("/customers/:clientId", getCustomers)
clientRouter.get("/customers", getCustomers)
clientRouter.put("/customers", editCustomers)
clientRouter.post("/customers", createCustomers)

export default clientRouter;