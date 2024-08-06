import express from "express";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import handleRouteNotFound from "./middlewares/handleRouteNotFound.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

mongoose.connect(process.env.MONGODB_CONNECT_URI);

const connection = mongoose.connection;

connection.on("error", (error) => {
  console.error("Error", error);
});

connection.once("open", () => {
  console.log("Connected successfully");
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

routes(app);

app.use(handleRouteNotFound);
app.use(globalErrorHandler);

app.listen(3000);
