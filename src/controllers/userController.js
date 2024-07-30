import "dotenv/config";
import { user } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      const { password, passwordConfirmation } = req.body;

      if (password !== passwordConfirmation) {
        throw new Error("Passwords do not match");
      }

      const emailAlreadyExists = await user.findOne({ email: req.body.email });

      if (emailAlreadyExists) {
        throw new Error("E-mail already exists");
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userData = {
        ...req.body,
        password: hashedPassword,
      };

      const newUser = await user.create(userData);

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

      if (!email) {
        throw new Error("Email are required");
      }

      if (!password) {
        throw new Error("Password are required");
      }

      const userData = await user.findOne({ email: email });

      if (!userData) {
        throw new Error("User not found");
      }

      const checkPassword = await bcrypt.compare(password, userData.password);

      if (!checkPassword) {
        throw new Error("Invalid password");
      }

      const secret = process.env.JWT_KEY;
      const token = jwt.sign({ id: userData._id }, secret, {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Successfully logged in", token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getUser(req, res) {
    try {
      const id = req.params.id;
      const userData = await user.findById(id, "-password");

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
      const deletedData = await user.findByIdAndDelete(id);

      if (!deletedData) {
        throw new Error("User not found");
      }

      res
        .status(200)
        .json({ message: "Successfully deleted", deleted: deletedData });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default UserController;
