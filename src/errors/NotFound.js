import BaseError from "./BaseError.js";

class NotFound extends BaseError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export default NotFound;
