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

  static async create({
    userId,
    category,
    difficulty,
    questionIds,
    invitedUsers,
  }) {
    const users = new Set([userId, ...(invitedUsers ?? [])]);
    console.log({ users, array: Array.from(users) });

    const trivia = await TriviaModel.create({
      users: Array.from(users),
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

    const triviaItems = user.triviaHistory[triviaIndex].items;

    if (triviaItems.some((item) => item.question.toString() === questionId)) {
      throw new BadRequest("Question already answered");
    }

    triviaItems.push(triviaHistoryItem);

    // TODO: Verify if it is single or multiplayer before updating trivia status
    const isTriviaCompleted = trivia.questions.length === triviaItems.length;
    if (isTriviaCompleted) {
      trivia.status = "completed";
      trivia.score = triviaItems.reduce(
        (acc, item) => acc + (item.isCorrect ? 1 : 0),
        0
      );
      await trivia.save();
    }

    const nextQuestion = await this.getNextQuestion(
      triviaId,
      userId,
      questionId
    );
    user.triviaHistory[triviaIndex].currentQuestion = nextQuestion?._id;
    user.triviaHistory[triviaIndex].completed = isTriviaCompleted;

    await user.save();

    return { isCorrect, question: nextQuestion, triviaStatus: trivia.status };
  }

  static async getHistory(userId) {
    const user = await UserModel.findById(userId, USER_LIST_PROJECTION)
      .populate([
        {
          path: "triviaHistory.trivia",
          select: "category difficulty users score status createdAt",
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

    await trivia.save();
  }

  static async getCurrentQuestion(triviaId, userId) {
    const user = await UserModel.findById(userId);
    const triviaDocument = await TriviaModel.findById(triviaId);

    if (!triviaDocument.users.includes(userId)) {
      throw new BadRequest("User is not part of the trivia");
    }

    const triviaHistory = user
      .toObject()
      .triviaHistory.find((item) => item.trivia.toString() === triviaId);

    if (triviaHistory?.completed) {
      throw new BadRequest("Trivia already completed");
    }

    const currentQuestionId = !triviaHistory.currentQuestion
      ? triviaDocument.questions[0]
      : triviaHistory.currentQuestion;

    const question = await QuestionModel.findById(currentQuestionId);
    return this.normalizeQuestionResponse(question);
  }

  static async getNextQuestion(triviaId, userId, currentQuestionId) {
    const user = await UserModel.findById(userId);
    const triviaDocument = await TriviaModel.findById(triviaId);

    if (!triviaDocument.users.includes(userId)) {
      throw new BadRequest("User is not part of the trivia");
    }

    const triviaHistory = user
      .toObject()
      .triviaHistory.find((item) => item.trivia.toString() === triviaId);

    if (triviaHistory?.completed) {
      throw new BadRequest("Trivia already completed");
    }

    const currentQuestionIndex = triviaDocument.questions.findIndex(
      (question) => question.toString() === currentQuestionId
    );

    if (currentQuestionIndex < 0) {
      throw new BadRequest("Question not found");
    }

    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex >= triviaDocument.questions.length) {
      return null;
    }

    const questionId = triviaDocument.questions[nextQuestionIndex].toString();
    const question = await QuestionModel.findById(questionId);

    return this.normalizeQuestionResponse(question);
  }

  static async getCategories() {
    const { data } = await axios.get("https://opentdb.com/api_category.php");

    const filteredCategories = data.trivia_categories.filter((item) =>
      CATEGORIES_ALLOWLIST.includes(item.id)
    );

    return filteredCategories;
  }

  static normalizeQuestionResponse(questionDocument) {
    const question = questionDocument.toObject();
    const answers = question.incorrectAnswers.concat(question.correctAnswer);

    delete question.incorrectAnswers;
    delete question.correctAnswer;

    return {
      ...question,
      answers: shuffleArray(answers),
    };
  }
}

export default TriviaService;
