export const isTriviaExpired = (trivia) => {
  return new Date() - trivia.createdAt >= ONE_DAY;
};
