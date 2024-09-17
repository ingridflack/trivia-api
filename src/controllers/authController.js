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

      const { token, user } = await AuthService.login(email, password);

      res.status(200).json({ message: "Successfully logged in", token, user });
    } catch (err) {
      next(err);
    }
  }

  static async requestRecoveryPasswordLink(req, res, next) {
    try {
      const { email } = req.body;

      await AuthService.requestRecoveryPasswordLink(email);

      res.status(200).json({ message: "Recovery email sent" });
    } catch (err) {
      next(err);
    }
  }

  static async resetPasswordData(req, res, next) {
    try {
      const { token } = req.params;
      const { password, passwordConfirmation } = req.body;

      await AuthService.resetPassword(token, password, passwordConfirmation);

      res.status(200).json({ message: "Password successfully changed" });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
