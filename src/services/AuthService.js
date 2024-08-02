import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

class AuthService {
  static async register(body) {
    const { password, passwordConfirmation } = body;

    if (password !== passwordConfirmation) {
      throw new Error("Passwords do not match");
    }

    const emailAlreadyExists = await UserModel.findOne({
      email: body.email,
    });

    if (emailAlreadyExists) {
      throw new Error("E-mail already exists");
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
      throw new Error("Email are required");
    }

    if (!password) {
      throw new Error("Password are required");
    }

    // const userData2 = new UserModel({
    //     email,
    //     password,
    //     checkPassword,
    // });

    // const errors = userData2.validateSync();
    // console.log(errors);

    const userData = await UserModel.findOne({ email: email });

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

    return token;
  }
}

export default AuthService;
