import express from "express";
import TriviaController from "../controllers/triviaController.js";
import checkToken from "../middlewares/checkToken.js";

const routes = express.Router();

routes.post("/trivia", checkToken, TriviaController.createTrivia);

export default routes;
