import express from "express";
import UserController from "../controllers/userController.js";
import checkToken from "../middlewares/checkToken.js";
import sameUserCheck from "../middlewares/sameUserCheck.js";

const routes = express.Router();

routes.get("/users", UserController.listUsers);
routes.get("/users/:id", checkToken, sameUserCheck, UserController.getUser);
routes.put("/users/:id", checkToken, sameUserCheck, UserController.updateUser);
routes.delete(
  "/users/:id",
  checkToken,
  sameUserCheck,
  UserController.deleteUser
);

export default routes;