import axios from "axios";
import QuestionModel from "../models/Question.js";
import TriviaModel from "../models/Trivia.js";
import UserModel from "../models/User.js";
import { isTriviaExpired } from "../utils/trivia.js";
import { shuffleArray } from "../utils/arrays.js";
import BadRequest from "../errors/BadRequest.js";
import { USER_LIST_PROJECTION } from "../constants/user.js";

const CATEGORIES_ALLOWLIST = [9, 10, 31, 19, 14];

class TriviaService {
  static async fetchQuestions(params) {
    const url = new URL("https://opentdb.com/api.php");

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "any") {
        url.searchParams.append(key, value);
      }
    });

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

  static async answerQuestion({
    userId,
    triviaId,
    questionId,
    answer,
    answerTime,
  }) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new BadRequest("User not found");
    }

    const trivia = await TriviaModel.findById(triviaId);

    if (!trivia) {
      throw new BadRequest("Trivia not found");
    }

    const question = await QuestionModel.findById(questionId);

    if (!question) {
      throw new BadRequest("Question not found");
    }

    const triviaIndex = user.triviaHistory.findIndex(
      (item) => item.trivia.toString() === triviaId
    );

    const isCorrect = question.correctAnswer === answer;
    const triviaHistoryItem = {
      question: questionId,
      isCorrect,
      answerTime,
    };

    if (triviaIndex < 0) {
      user.triviaHistory.push({
        trivia: triviaId,
        items: [triviaHistoryItem],
      });
    } else {
      const triviaItems = user.triviaHistory[triviaIndex].items;

      if (triviaItems.some((item) => item.question.toString() === questionId)) {
        throw new BadRequest("Question already answered");
      }

      triviaItems.push(triviaHistoryItem);

      const isTriviaCompleted = trivia.questions.length === triviaItems.length;

      // TODO: Verify if it is single or multiplayer before updating trivia status

      if (isTriviaCompleted) {
        trivia.status = "completed";
        await trivia.save();
      }
    }

    await user.save();

    return { isCorrect, triviaStatus: trivia.status };
  }

  static async getHistory(userId) {
    const user = await UserModel.findById(userId, USER_LIST_PROJECTION)
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

    return user.triviaHistory;
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

    const filteredCategories = data.trivia_categories.filter((item) =>
      CATEGORIES_ALLOWLIST.includes(item.id)
    );

    return filteredCategories;
  }
}

export default TriviaService;
