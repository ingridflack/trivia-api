import express from "express";
import SwaggerUI from "swagger-ui-express";
import users from "./userRoutes.js";
import trivia from "./triviaRoutes.js";
import swaggerFile from "../swagger-output.json" with { type: "json" };

const routes = (app) => {
  app.route("/").get((_, res) => res.status(200).send("Hello World!"));

  app.use(express.json(), users, trivia);
  app.use("/docs", SwaggerUI.serve, SwaggerUI.setup(swaggerFile));
};

export default routes;