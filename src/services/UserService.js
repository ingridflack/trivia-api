import NotFound from "../errors/NotFound.js";
import UserModel from "../models/User.js";

class UserService {
  static async list() {
    return await UserModel.find({});
  }

  static async getById(id) {
    const userData = await UserModel.findById(id, "-password -createdAt -__v");

    if (!userData) {
      throw new NotFound("User not found");
    }

    return userData;
  }

  static async update(id, body) {
    const updatedUser = await UserModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedUser) {
      next(new NotFound("User not found"));
    }

    return updatedUser;
  }

  static async delete(id) {
    const deletedData = await UserModel.findByIdAndDelete(id);

    if (!deletedData) {
      next(new NotFound("User not found"));
    }

    return deletedData;
  }
}

export default UserService;
