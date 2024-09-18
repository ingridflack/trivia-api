import mongoose from "mongoose";

const triviaHistoryItemSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  isCorrect: { type: Boolean },
  answerTime: { type: Number },
});

const triviaHistorySchema = new mongoose.Schema({
  trivia: { type: mongoose.Schema.Types.ObjectId, ref: "Trivia" },
  currentQuestion: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  completed: { type: Boolean },
  items: [triviaHistoryItemSchema],
});

export const userSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  username: {
    type: String,
    required: [true, "Username is required."],
    match: [/^\S*$/, "Username should not contain spaces."],
  },
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    lowercase: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  resetPassword: {
    token: { type: String },
    expiration: { type: Date },
  },
  triviaHistory: [triviaHistorySchema],
  avatar: { type: String, required: [false] },
  score: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
