import express from "express";
import UserController from "../controllers/userController.js";
import checkToken from "../middlewares/checkToken.js";

const routes = express.Router();

routes.get("/users/all", UserController.listUsers);
routes.get("/users", checkToken, UserController.getUser);
routes.put("/users", checkToken, UserController.updateUser);
routes.delete("/users", checkToken, UserController.deleteUser);

export default routes;