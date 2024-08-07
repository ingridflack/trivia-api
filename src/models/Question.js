import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  question: { type: String, required: [true, "Question is required."] },
  category: { type: String, required: [true, "Category is required."] },
  difficulty: { type: String, required: [true, "Difficulty is required."] },
  correctAnswer: {
    type: String,
    required: [true, "Correct answer is required."],
  },
  incorrectAnswers: { type: [String] },
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
