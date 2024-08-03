import BaseError from "./BaseError.js";

class BadRequest extends BaseError {
  constructor(message = "Incorrect data") {
    super(message, 400);
  }
}

export default BadRequest;
