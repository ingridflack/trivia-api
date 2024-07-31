import mongoose from "mongoose";

const triviaSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User ID is required."],
    ref: "User",
  },
  score: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const Trivia = mongoose.model("Trivia", triviaSchema);

export default Trivia;
