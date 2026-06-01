const validateMiddleware = (validationFn) => {
  return (req, res, next) => {
    const { error } = validationFn(req.body);

    if (error) {
      //   return all errors
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ errors });
    }

    next();
  };
};

module.exports = validateMiddleware;
