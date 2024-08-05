import TriviaService from "../services/TriviaService.js";

class TriviaController {
  static async createTrivia(req, res, next) {
    /*
      #swagger.tags = ['Trivia']
      #swagger.summary = 'Generates a new trivia'
    */
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
      next(err);
    }
  }

  static async completeTrivia(req, res, next) {
    /*
      #swagger.tags = ['Trivia']
      #swagger.summary = 'Completes a trivia'
      #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Trivia information',
        required: true,
        schema: { $ref: "#/definitions/Trivia" }
      }
    */
    try {
      const userId = req.userId;
      const triviaId = req.params.id;
      const { completedTrivia } = req.body;

      await TriviaService.complete({ userId, triviaId, completedTrivia });

      res.status(200).json({
        message: "Trivia saved successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTriviaHistory(req, res, next) {
    /*
      #swagger.tags = ['Trivia']
      #swagger.summary = 'Returns the list of trivias'
      #swagger.parameters['id'] = { description: 'User ID' }

    */
    try {
      const userId = req.userId;

      const user = await TriviaService.getHistory(userId);

      res.status(200).json({
        message: "The list of trivias was retrieved successfully",
        trivias: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async acceptInvite(req, res, next) {
    /*
      #swagger.tags = ['Trivia']
      #swagger.summary = 'Accepts a trivia challenge'
      #swagger.parameters['id'] = { description: 'Trivia ID' }
    */
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
      next(err);
    }
  }

  static async getCategories(_, res, next) {
    /*
      #swagger.tags = ['Trivia']
      #swagger.summary = 'Returns the list of categories'
    */
    try {
      const categories = await TriviaService.getCategories();

      res.status(200).json({
        message: "Categories retrieved successfully",
        categories: categories,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default TriviaController;
