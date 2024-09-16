import "dotenv/config";
import UserService from "../services/UserService.js";

class UserController {
  static async listUsers(req, res, next) {
    try {
      const params = {};
      const username = req.query.username;

      if (username) {
        params.username = { $regex: username, $options: "i" };
      }

      const userList = await UserService.findBy(params);
      res.send(userList);
    } catch (err) {
      next(err);
    }
  }

  static async getUser(req, res, next) {
    try {
      const userData = await UserService.getById(req.userId, next);

      res.status(200).json(userData);
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { name, username, avatar, password } = req.body;

      const body = {
        name,
        avatar,
        username,
        password,
      };

      const updatedUser = await UserService.update(req.userId, body);

      res
        .status(200)
        .json({ message: "Successfully updated", user: updatedUser });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const deletedData = await UserService.delete(req.userId);
      res
        .status(200)
        .json({ message: "Successfully deleted", deleted: deletedData });
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
