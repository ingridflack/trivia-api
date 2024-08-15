import { jest } from "@jest/globals";
import UserService from "../../services/UserService.js";
import UserModel from "../../models/User.js";

jest.mock("../../models/User.js", () => ({
  find: jest.fn(),
}));

describe("UserService", () => {
  describe("list", () => {
    test("should return all users", async () => {
      const mockUsers = [
        { name: "Batatinha", age: 25 },
        { name: "Guadalupe", age: 30 },
      ];

      console.log(UserModel.find);

      UserModel.find.mockResolvedValue(mockUsers);

      const users = await UserService.list();

      expect(UserModel.find).toHaveBeenCalledTimes(1);
      expect(users).toEqual(mockUsers);
    });
  });
});
