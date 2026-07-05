const reviewService = require("../services/reviewService");

async function listReviews(req, res) {
  const reviews = await reviewService.getReviews();
  res.status(200).json(reviews);
}

module.exports = {
  listReviews,
};
