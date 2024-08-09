import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import handleRouteNotFound from "./middlewares/handleRouteNotFound.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import connectDatabase from "./config/dbConnect.js";

const connection = await connectDatabase();

connection.on("error", (error) => {
  console.error("Error", error);
});

connection.once("open", () => {
  console.log("Connected successfully");
});

const app = express();

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

routes(app);

app.use(handleRouteNotFound);
app.use(globalErrorHandler);

app.listen(3000);
