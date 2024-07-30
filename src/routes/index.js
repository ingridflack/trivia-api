import express from "express";
import users from "./userRoutes.js";

const routes = (app) => {
  app.route("/").get((_, res) => res.status(200).send("Hello World!"));

  app.use(express.json(), users);
};

export default routes;