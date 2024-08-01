import mongoose from "mongoose";

const triviaItemSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  question: { type: String, required: [true, "Question is required."] },
  category: { type: String, required: [true, "Category is required."] },
  difficulty: { type: String, required: [true, "Difficulty is required."] },
  createdAt: { type: Date, default: Date.now },
});

const TriviaItem = mongoose.model("TriviaItem", triviaItemSchema);

export default TriviaItem;
