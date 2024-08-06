import AuthService from "../services/AuthService.js";

class AuthController {
  static async register(req, res, next) {
    try {
      const body = req.body;

      const newUser = await AuthService.register(body);

      res
        .status(201)
        .json({ message: "Successfully registered", user: newUser });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const token = await AuthService.login(email, password);

      res.status(200).json({ message: "Successfully logged in", token });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
