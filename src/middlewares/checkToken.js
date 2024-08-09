import "dotenv/config";
import jwt from "jsonwebtoken";
import BaseError from "../errors/BaseError.js";

const checkToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new BaseError("No token provided", 401);
    }

    jwt.verify(token, process.env.JWT_KEY);

    // Set the userId in the request object.
    const decodedToken = jwt.decode(token, { complete: true });

    const currentTime = Date.now() / 1000;
    const expirationTime = decodedToken.payload.exp;

    if (currentTime > expirationTime) {
      throw new BaseError("Token expired", 401);
    }

    req.userId = decodedToken.payload.id;

    next();
  } catch (err) {
    throw new BaseError("Unauthorized", 401);
  }
};

export default checkToken;
