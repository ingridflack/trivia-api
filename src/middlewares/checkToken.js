import "dotenv/config";
import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  try {
    const authHEader = req.headers.authorization;
    const token = authHEader && authHEader.split(" ")[1];

    if (!token) {
      throw new Error("No token provided");
    }

    const secret = process.env.JWT_KEY;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default checkToken;
