import express from "express";
import TriviaController from "../controllers/triviaController.js";
import checkToken from "../middlewares/checkToken.js";

const routes = express.Router();

routes.post("/trivia", checkToken, TriviaController.createTrivia);
routes.get("/trivia/history", checkToken, TriviaController.getTriviaHistory);
routes.get("/trivia/pending", checkToken, TriviaController.getPendingTrivia);
routes.get("/trivia/categories", checkToken, TriviaController.getCategories);
routes.get("/trivia/:id", checkToken, TriviaController.getTrivia);
routes.post("/trivia/:id/answer", checkToken, TriviaController.answerQuestion);

export default routes;
