const sameUserCheck = (req, res, next) => {
  try {
    const id = req.params.id;

    if (id !== req.userId) {
      throw new Error();
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default sameUserCheck;
