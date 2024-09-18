import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import BadRequest from "../errors/BadRequest.js";
import NotFound from "../errors/NotFound.js";
import { HOUR } from "../constants/time.js";
class AuthService {
  static async register(body) {
    const { password, passwordConfirmation } = body;

    if (password !== passwordConfirmation) {
      throw new BadRequest("The password confirmation does not match");
    }

    const userWithSameCredentials = await UserModel.findOne({
      $or: [{ email: body.email }, { username: body.username }],
    });

    if (userWithSameCredentials) {
      throw new BadRequest("E-mail or username already exists");
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

    // Remove sensitive data from the response
    const newUserObj = newUser.toObject();

    delete newUserObj.password;
    delete newUserObj.__v;
    delete newUserObj.createdAt;

    return newUserObj;
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
      expiresIn: "1d",
    });

    const user = {
      id: userData._id,
      avatar: userData.avatar,
      username: userData.username,
    };

    return { token, user };
  }

  static async requestRecoveryPasswordLink(email) {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      throw new NotFound("User not found");
    }

    // Generate a random token
    const token = randomBytes(20).toString("hex");
    user.resetPassword = {
      token,
      expiration: Date.now() + HOUR,
    };

    await user.save();

    // Send email
    const mailOptions = {
      to: user.email,
      from: process.env.SMTP_USER,
      template_uuid: "08fc0fad-1c2f-48d0-90ba-e986af17da22",
      template_variables: {
        pass_reset_link: `${process.env.BASE_URL}/reset/${token}`,
      },
      subject: "Password Reset",
      text: `Click here to reset your password: ${process.env.BASE_URL}/reset/${token}`,
    };

    // await transporter.sendMail(mailOptions);
  }

  static async resetPassword(token, password, passwordConfirmation) {
    if (password !== passwordConfirmation) {
      throw new BadRequest("The password confirmation does not match");
    }

    const user = await UserModel.findOne({
      "resetPassword.token": token,
      "resetPassword.expiration": { $gt: Date.now() },
    });

    if (!user) {
      throw new BadRequest("Token is invalid or has expired.");
    }

    // Update password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPassword = undefined;

    await user.save();
  }
}

export default AuthService;
