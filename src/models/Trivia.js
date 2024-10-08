import mongoose from "mongoose";

const triviaSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required."],
      ref: "User",
    },
  ],
  category: { type: String, required: [true, "Category is required."] },
  difficulty: { type: String, required: [true, "Difficulty is required."] },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  status: {
    type: String,
    enum: ["pending", "expired", "completed"],
    default: "pending",
  },
  gameMode: {
    type: String,
    enum: ["normal", "infinite"],
    default: "normal",
  },
  createdAt: { type: Date, default: Date.now },
});

const Trivia = mongoose.model("Trivia", triviaSchema);

export default Trivia;
