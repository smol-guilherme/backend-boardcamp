import { Router } from "express";
import { createCategories, getCategories } from "../controllers/categoryControllers.js";
import { createGames, getGames } from "../controllers/gameControllers.js";

const serviceRouter = Router();

serviceRouter.get("/games", getGames)
serviceRouter.post("/games", createGames)
serviceRouter.get("/categories", getCategories)
serviceRouter.post("/categories", createCategories)

export default serviceRouter;

