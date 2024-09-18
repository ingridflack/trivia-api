import NotFound from "../errors/NotFound.js";
import UserModel from "../models/User.js";
import { USER_LIST_PROJECTION } from "../constants/user.js";

class UserService {
  static async findBy(params) {
    return UserModel.find(params, "_id username");
  }

  static async getById(id) {
    const userData = await UserModel.findById(id, USER_LIST_PROJECTION);

    if (!userData) {
      throw new NotFound("User not found");
    }

    return userData;
  }

  static async update(id, body) {
    const updatedUser = await UserModel.findByIdAndUpdate(id, body, {
      new: true,
      projection: USER_LIST_PROJECTION,
    });

    if (!updatedUser) {
      throw new NotFound("User not found");
    }

    return updatedUser;
  }

  static async delete(id) {
    const deletedData = await UserModel.findByIdAndDelete(id, {
      projection: USER_LIST_PROJECTION,
    });

    if (!deletedData) {
      throw new NotFound("User not found");
    }

    return deletedData;
  }

  static async addTrivia(users, triviaId) {
    for (const userId of users) {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new NotFound("User not found");
      }

      const triviaExists = user.triviaHistory.find(
        (trivia) => trivia.trivia.toString() === triviaId
      );

      if (triviaExists) continue;

      user.triviaHistory.push({
        trivia: triviaId,
        currentQuestion: null,
        items: [],
        completed: false,
      });

      await user.save();
    }
  }
}

export default UserService;
