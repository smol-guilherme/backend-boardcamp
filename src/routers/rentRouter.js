import { Router } from "express";
import { createRentals, getRentals } from "../controllers/rentalControllers.js";
import rentDate from "../middlewares/rentDate.js";

const rentRouter = Router();

rentRouter.get("/rentals", getRentals)
rentRouter.put("/rentals")
rentRouter.post("/rentals", rentDate, createRentals)
rentRouter.delete("/rentals")

export default rentRouter;