import express from "express";
import AuthController from "../controllers/authController.js";

const routes = express.Router();

routes.post("/register", AuthController.register);
routes.post("/login", AuthController.login);
routes.post("/forgot-password", AuthController.requestRecoveryPasswordLink);
routes.post("/reset/:token", AuthController.resetPasswordData);

export default routes;
