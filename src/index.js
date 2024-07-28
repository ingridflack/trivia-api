import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
  },
  { versionKey: false }
);

const user = mongoose.model("users", userSchema);

mongoose.connect('mongodb://mongo:27017/trivia');

const connection = mongoose.connection;

connection.on("error", (error) => {
  console.error("Error", error);
});

connection.once("open", () => {
  console.log("Connected successfully");
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const data = await user.find({});
  res.send(data);
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await user.findById(id);
  res.send(data);
});

app.listen(3000);
