const HttpError = require("../helpers/HttpError");

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join("; ");
      next(HttpError(400, message));
      return;
    }

    req.body = value;
    next();
  };
}

module.exports = validateBody;
