import "dotenv/config";
import UserService from "../services/UserService.js";
import AuthService from "../services/AuthService.js";

class UserController {
  static async listUsers(_, res, next) {
    /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Returns a list of users'
    */
    try {
      const userList = await UserService.list();
      res.send(userList);
    } catch (err) {
      next(err);
    }
  }

  static async registerUser(req, res, next) {
    /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Registers a new user'
      #swagger.parameters['obj'] = {
        in: 'body',
        description: 'User information',
        required: true,
        schema: { $ref: "#/definitions/User" }
      }
    */
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

  static async loginUser(req, res, next) {
    /*
      #swagger.auto = false
      #swagger.tags = ['Users']
      #swagger.summary = 'Logs in a user'
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'User data.',
            required: true,
            schema: {
                email: "test@email.com",
                password: "1234"
            }
        }
    */
    try {
      const { email, password } = req.body;

      const token = await AuthService.login(email, password);

      res.status(200).json({ message: "Successfully logged in", token });
    } catch (err) {
      next(err);
    }
  }

  static async getUser(req, res, next) {
    /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Returns a user by ID'
      #swagger.parameters['id'] = { description: 'User ID' }
      #swagger.security = [{ "bearerAuth": [] }]
    */
    try {
      const id = req.params.id;
      const userData = await UserService.getById(id, next);

      res.status(200).json(userData);
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res, next) {
    /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Updates a user'
      #swagger.parameters['id'] = { description: 'User ID' }
      #swagger.parameters['obj'] = {
        in: 'body',
        description: 'User information',
        required: true,
        schema: { $ref: "#/definitions/User" }
      }
    */
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
      next(err);
    }
  }

  static async deleteUser(req, res, next) {
    /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Deletes a user'
      #swagger.parameters['id'] = { description: 'User ID' }
    */
    try {
      const id = req.params.id;
      const deletedData = await UserService.delete(id);
      res
        .status(200)
        .json({ message: "Successfully deleted", deleted: deletedData });
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
