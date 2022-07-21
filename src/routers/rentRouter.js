import { Router } from "express";
import { getRentals } from "../controllers/rentalControllers.js";

const rentRouter = Router();

rentRouter.get("/rentals", getRentals)
rentRouter.put("/rentals")
rentRouter.post("/rentals")
rentRouter.delete("/rentals")

export default rentRouter;