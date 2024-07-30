import express from "express";
import UserController from "../controllers/userController.js";
import checkToken from "../middlewares/checkToken.js";

const routes = express.Router();

routes.get("/users", UserController.listUsers);
routes.get("/users/:id", checkToken, UserController.getUser);
routes.post("/register", UserController.registerUser);
routes.post("/users/login", UserController.loginUser);
routes.put("/users/:id", UserController.updateUser);
routes.delete("/users/:id", UserController.deleteUser);

export default routes;