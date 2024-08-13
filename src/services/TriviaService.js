import axios from "axios";
import QuestionModel from "../models/Question.js";
import TriviaModel from "../models/Trivia.js";
import User from "../models/User.js";
import { isTriviaExpired } from "../utils/trivia.js";
import { shuffleArray } from "../utils/arrays.js";
import BadRequest from "../errors/BadRequest.js";
import { USER_LIST_PROJECTION } from "../constants/user.js";

class TriviaService {
  static async fetchQuestions({ amount, category, difficulty, type }) {
    const url = new URL("https://opentdb.com/api.php");
    url.searchParams.append("amount", amount);
    url.searchParams.append("category", category);
    url.searchParams.append("difficulty", difficulty);
    url.searchParams.append("type", type);

    const { data } = await axios.get(url.toString());

    return data.results;
  }

  static async saveQuestions(questions) {
    const result = await QuestionModel.bulkWrite(
      questions.map((item) => ({
        insertOne: {
          document: {
            question: item.question,
            category: item.category,
            difficulty: item.difficulty,
            correctAnswer: item.correct_answer,
            incorrectAnswers: item.incorrect_answers,
          },
        },
      }))
    );

    return Object.values(result.insertedIds);
  }

  static async create({ userId, category, difficulty, questionIds }) {
    const trivia = await TriviaModel.create({
      users: [userId],
      category,
      difficulty,
      questions: questionIds,
    });

    return trivia._id;
  }

  static async complete({ userId, triviaId, completedTrivia }) {
    const user = await User.findById(userId);

    if (!user) {
      throw new BadRequest("User not found");
    }

    const isTriviaCompleted = user.triviaHistory.some(
      (item) => item.trivia.toString() === triviaId
    );

    if (isTriviaCompleted) {
      throw new BadRequest("Trivia already completed");
    }

    user.triviaHistory.push({
      trivia: triviaId,
      items: completedTrivia,
      status: "completed",
    });

    await user.save();
  }

  static async getHistory(userId) {
    const user = await User.findById(userId, USER_LIST_PROJECTION)
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

    return user;
  }

  static async acceptInvite({ userId, id }) {
    const trivia = await TriviaModel.findById(id);

    if (!trivia) {
      throw new BadRequest("Trivia not found");
    }

    if (trivia.status === "expired") {
      throw new BadRequest("Trivia has expired");
    }

    if (trivia.status === "completed") {
      throw new BadRequest("Trivia has already been completed");
    }

    const triviaIsExpired = isTriviaExpired(trivia);

    if (triviaIsExpired) {
      trivia.status = "expired";
      await trivia.save();
      throw new BadRequest("Trivia has expired");
    }

    if (trivia.users.includes(userId)) {
      throw new BadRequest("User already accepted the invitation");
    }

    trivia.users.push(userId);

    const updatedTrivia = await trivia.save();

    return await updatedTrivia.populate([
      {
        path: "users",
        select: "username name avatar",
      },
      {
        path: "questions",
        select: "question category difficulty",
      },
    ]);
  }

  static async getTriviaById(triviaId, userId) {
    const triviaDocument = await TriviaModel.findById(triviaId);

    if (!triviaDocument.users.includes(userId)) {
      throw new BadRequest("User is not part of the trivia");
    }

    const triviaPopulatedDocument = await triviaDocument.populate([
      {
        path: "questions",
        select: "question category difficulty correctAnswer incorrectAnswers",
      },
    ]);

    const trivia = triviaPopulatedDocument.toObject();

    trivia.questions = trivia.questions.map((question) => {
      const answers = question.incorrectAnswers.concat(question.correctAnswer);

      delete question.incorrectAnswers;
      delete question.correctAnswer;

      return {
        ...question,
        answers: shuffleArray(answers),
      };
    });

    delete trivia.users;

    return trivia;
  }

  static async getCategories() {
    const { data } = await axios.get("https://opentdb.com/api_category.php");

    return data.trivia_categories;
  }
}

export default TriviaService;
