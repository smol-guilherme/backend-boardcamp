import { Router } from "express";
import { createRentals, deleteRentals, getRentals, updateRentals } from "../controllers/rentalControllers.js";
import rentDate from "../middlewares/rentDate.js";

const rentRouter = Router();

rentRouter.get("/rentals", getRentals)
rentRouter.post("/rentals", rentDate, createRentals)
rentRouter.post("/rentals/:id/return", rentDate, updateRentals)
rentRouter.delete("/rentals/:id", deleteRentals)

export default rentRouter;