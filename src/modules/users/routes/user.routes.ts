import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();
const controller = new UserController();

userRoutes.post('/', (req, res) => controller.create(req, res));

export { userRoutes };