import { Router } from "express";

const rentRouter = Router();

rentRouter.get("/rentals")
rentRouter.put("/rentals")
rentRouter.post("/rentals")
rentRouter.delete("/rentals")

export default rentRouter;