import mongoose from "mongoose";

const triviaItemSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  triviaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Trivia ID is required."],
    ref: "Trivia",
  },
  question: { type: String, required: [true, "Question is required."] },
  category: { type: String, required: [true, "Category is required."] },
  isCorrect: { type: Boolean },
  difficulty: { type: String, required: [true, "Difficulty is required."] },
  createdAt: { type: Date, default: Date.now },
});

const TriviaItem = mongoose.model("TriviaItem", triviaItemSchema);

export default TriviaItem;
