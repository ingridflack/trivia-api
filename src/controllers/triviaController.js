import TriviaService from "../services/TriviaService.js";

class TriviaController {
  static async createTrivia(req, res) {
    try {
      const userId = req.userId;
      const { amount, category, difficulty, type } = req.query;

      const questions = await TriviaService.fetchQuestions({
        amount,
        category,
        difficulty,
        type,
      });

      const questionIds = await TriviaService.saveQuestions(questions);
      const populatedTrivia = await TriviaService.create({
        userId,
        category,
        difficulty,
        questionIds,
      });

      res.status(200).json({
        message: "Trivia created successfully",
        trivia: populatedTrivia,
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

      await TriviaService.complete({ userId, triviaId, completedTrivia });

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

      const user = await TriviaService.getHistory(userId);

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

      const trivia = await TriviaService.acceptInvite({
        userId,
        id,
      });

      res.status(200).json({
        message: "Successfully accepted challenge",
        trivia,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getCategories(_, res) {
    try {
      const categories = await TriviaService.getCategories();

      res.status(200).json({
        message: "Categories retrieved successfully",
        categories: categories,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default TriviaController;
