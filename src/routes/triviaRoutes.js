import express from "express";
import TriviaController from "../controllers/triviaController.js";
import checkToken from "../middlewares/checkToken.js";

const routes = express.Router();

routes.post("/trivia", checkToken, TriviaController.createTrivia);
routes.get("/trivia/history", checkToken, TriviaController.getTriviaHistory);
routes.get("/trivia/categories", checkToken, TriviaController.getCategories);
routes.get("/trivia/:id", checkToken, TriviaController.getTrivia);
routes.post("/trivia/:id", checkToken, TriviaController.completeTrivia);
routes.post(
  "/trivia/:id/invite/accept",
  checkToken,
  TriviaController.acceptInvite
);

export default routes;
