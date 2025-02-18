const restrictToSystemOnly = (req, res, next) => {
  if (req.user_type !== "system") {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }
  next();
};

export { restrictToSystemOnly };
