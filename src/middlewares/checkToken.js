import "dotenv/config";
import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new Error("No token provided");
    }

    jwt.verify(token, process.env.JWT_KEY);

    // Set the userId in the request object.
    const decodedToken = jwt.decode(token, { complete: true });
    req.userId = decodedToken.payload.id;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default checkToken;
