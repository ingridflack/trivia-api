import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import BadRequest from "../errors/BadRequest.js";
import NotFound from "../errors/NotFound.js";

class AuthService {
  static async register(body) {
    const { password, passwordConfirmation } = body;

    if (password !== passwordConfirmation) {
      throw new BadRequest("Passwords do not match");
    }

    const emailAlreadyExists = await UserModel.findOne({
      email: body.email,
    });

    if (emailAlreadyExists) {
      throw new BadRequest("E-mail already exists");
    }

    const error = new UserModel(body).validateSync();

    if (error) {
      throw error;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      ...body,
      password: hashedPassword,
    };

    const newUser = await UserModel.create(userData);

    return newUser;
  }

  static async login(email, password) {
    if (!email) {
      throw new BadRequest("Email are required");
    }

    if (!password) {
      throw new BadRequest("Password are required");
    }

    const userData = await UserModel.findOne({ email: email });

    if (!userData) {
      throw new NotFound("User not found");
    }

    const checkPassword = await bcrypt.compare(password, userData.password);

    if (!checkPassword) {
      throw new BadRequest("Invalid password");
    }

    const secret = process.env.JWT_KEY;
    const token = jwt.sign({ id: userData._id }, secret, {
      expiresIn: "1h",
    });

    return token;
  }
}

export default AuthService;
