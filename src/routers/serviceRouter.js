import { Router } from "express";
import { createCategories, getCategories } from "../controllers/categoryControllers.js";

const serviceRouter = Router();

serviceRouter.get("/games", (req, res) => res.status(200).send(res.locals.path))
serviceRouter.post("/games")
serviceRouter.get("/categories", getCategories)
serviceRouter.post("/categories", createCategories)

export default serviceRouter;

