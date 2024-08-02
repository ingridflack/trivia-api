import "dotenv/config";
import UserService from "../services/UserService.js";
import AuthService from "../services/AuthService.js";

class UserController {
  static async listUsers(_, res) {
    try {
      const userList = await UserService.list();
      res.send(userList);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async registerUser(req, res) {
    try {
      const body = req.body;

      const newUser = await AuthService.register(body);

      res
        .status(201)
        .json({ message: "Successfully registered", user: newUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const token = await AuthService.login(email, password);

      res.status(200).json({ message: "Successfully logged in", token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getUser(req, res) {
    try {
      const id = req.params.id;
      const userData = await UserService.getById(id);

      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const id = req.params.id;
      const { name, username, avatar, password } = req.body;

      const body = {
        name,
        avatar,
        username,
        password,
      };

      const updatedUser = await UserService.update(id, body);

      res
        .status(200)
        .json({ message: "Successfully updated", user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const deletedData = await UserService.delete(id);
      res
        .status(200)
        .json({ message: "Successfully deleted", deleted: deletedData });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default UserController;
