import mongoose from "mongoose";
import BaseError from "../errors/BaseError.js";
import BadRequest from "../errors/BadRequest.js";
import ValidationError from "../errors/ValidationError.js";

// eslint-disable-next-line no-unused-vars
function globalErrorHandler(err, req, res, next) {
  console.log(err);

  if (err instanceof mongoose.Error.CastError)
    return new BadRequest().sendResponse(res);

  if (err instanceof mongoose.Error.ValidationError)
    return new ValidationError(err).sendResponse(res);

  if (err instanceof BaseError) return err.sendResponse(res);

  return new BaseError().sendResponse(res);
}

export default globalErrorHandler;
