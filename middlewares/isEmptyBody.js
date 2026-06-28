const HttpError = require("../helpers/HttpError");

function isEmptyBody(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    next(HttpError(400, "Body must have at least one field"));
    return;
  }

  next();
}

module.exports = isEmptyBody;
