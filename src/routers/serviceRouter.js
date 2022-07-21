import { Router } from "express";

const serviceRouter = Router();

serviceRouter.get("/games", (req, res) => res.status(200).send(res.locals.path))
serviceRouter.post("/games")
serviceRouter.get("/categories")
serviceRouter.post("/categories")

export default serviceRouter;

