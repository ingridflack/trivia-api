import BadRequest from "./BadRequest.js";

class ValidationError extends BadRequest {
  constructor(err) {
    const errorMessages = Object.values(err.errors)
      .map((err) => err.message)
      .join("; ");

    super(`Error: ${errorMessages}`);
  }
}

export default ValidationError;
