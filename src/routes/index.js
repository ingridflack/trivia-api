import express from "express";
import users from "./userRoutes.js";
import trivia from "./triviaRoutes.js";
import auth from "./authRoutes.js";

const routes = (app) => {
  app.route("/").get((_, res) => res.status(200).send("Hello World!"));

  app.use(express.json(), users, trivia, auth);
};

export default routes;
