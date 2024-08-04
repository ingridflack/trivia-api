import NotFound from "../errors/NotFound.js";
import UserModel from "../models/User.js";
import { USER_LIST_PROJECTION } from "../constants/user.js";

class UserService {
  static async list() {
    return await UserModel.find({});
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
}

export default UserService;
