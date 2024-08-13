import { ONE_DAY } from "../constants/time.js";

export const isTriviaExpired = (trivia) => {
  return new Date() - trivia.createdAt >= ONE_DAY;
};
