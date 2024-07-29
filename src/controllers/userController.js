import { user } from "../models/User.js";

class UserController {
  static async listUsers(_, res) {
    try {
        const userList = await user.find({});
        res.send(userList);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async registerUser(req, res) {
    try {
      const newUser = await user.create(req.body);
      res
        .status(201)
        .json({ message: "Successfully registered", user: newUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getUser(req, res) {
    try {
      const id = req.params.id;
      const userData = await user.findById(id);

      if (!userData) {
        throw new Error("User not found");
      } 

      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { name, username, avatar, password } = req.body;

      const id = req.params.id;

      const body = {
        name,
        avatar,
        username,
        password,
      };
      
      const updatedUser = await user.findByIdAndUpdate(id, body, { new: true });

      if (!updatedUser) {
        throw new Error("User not found");
      }

      res.status(200).json({ message: "Successfully updated", user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const id = req.params.id;
     const deletedData = await user.findByIdAndDelete(id);

      if (!deletedData) {
        throw new Error("User not found");
      } 

      res.status(200).json({ message: "Successfully deleted", deleted: deletedData });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default UserController;
