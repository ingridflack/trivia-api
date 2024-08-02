import axios from "axios";
import TriviaModel from "../models/Trivia.js";
import QuestionModel from "../models/Question.js";
import User from "../models/User.js";
import { isTriviaExpired } from "../utils/isTriviaExpired.js";

class TriviaController {
  static async createTrivia(req, res) {
    try {
      const userId = req.userId;
      const { amount, category, difficulty, type } = req.query;

      const url = new URL("https://opentdb.com/api.php");
      url.searchParams.append("amount", amount);
      url.searchParams.append("category", category);
      url.searchParams.append("difficulty", difficulty);
      url.searchParams.append("type", type);

      const { data } = await axios.get(url.toString());

      const questions = await QuestionModel.bulkWrite(
        data.results.map((item) => ({
          insertOne: {
            document: {
              question: item.question,
              category: item.category,
              difficulty: item.difficulty,
            },
          },
        }))
      );

      const trivia = await TriviaModel.create({
        users: [userId],
        category,
        difficulty,
        questions: Object.values(questions.insertedIds),
      });

      res.status(200).json({
        message: "Trivia created successfully",
        questions: data.results,
        triviaId: trivia._id,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async completeTrivia(req, res) {
    try {
      const userId = req.userId;
      const triviaId = req.params.id;
      const { completedTrivia } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const isTriviaCompleted = user.triviaHistory.some(
        (item) => item.trivia.toString() === triviaId
      );

      if (isTriviaCompleted) {
        throw new Error("Trivia already completed");
      }

      user.triviaHistory.push({
        trivia: triviaId,
        items: completedTrivia,
        status: "completed",
      });

      await user.save();

      // Process the trivia submission and return its updated status

      res.status(200).json({
        message: "Trivia saved successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getTriviaHistory(req, res) {
    try {
      const userId = req.userId;

      const user = await User.findById(userId)
        .populate([
          {
            path: "triviaHistory.trivia",
            select: "category difficulty users",
            populate: {
              path: "users",
              select: "name username avatar",
            },
          },
          {
            path: "triviaHistory.items.question",
            select: "question category difficulty",
          },
        ])
        .exec();

      res.status(200).json({
        message: "The list of trivias was retrieved successfully",
        trivias: user,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async acceptInvite(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;

      const trivia = await TriviaModel.findById(id);

      if (!trivia) {
        throw new Error("Trivia not found");
      }

      if (trivia.status === "expired") {
        throw new Error("Trivia has expired");
      }

      if (trivia.status === "completed") {
        throw new Error("Trivia has already been completed");
      }

      const triviaIsExpired = isTriviaExpired(trivia);

      if (triviaIsExpired) {
        trivia.status = "expired";
        await trivia.save();
        throw new Error("Trivia has expired");
      }

      if (trivia.users.includes(userId)) {
        throw new Error("User already accepted the invitation");
      }

      trivia.users.push(userId);

      const updatedTrivia = await trivia.save();

      const populatedTrivia = await updatedTrivia.populate([
        {
          path: "users",
          select: "username name avatar",
        },
        {
          path: "questions",
          select: "question category difficulty",
        },
      ]);

      res.status(200).json({
        message: "Successfully accepted challenge",
        trivia: populatedTrivia,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getCategories(_, res) {
    try {
      const { data } = await axios.get("https://opentdb.com/api_category.php");

      res.status(200).json({
        message: "Categories retrieved successfully",
        categories: data.trivia_categories,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default TriviaController;
