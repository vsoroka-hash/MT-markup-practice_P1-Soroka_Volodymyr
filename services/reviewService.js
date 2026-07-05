const { Review } = require("../models");

function getReviews() {
  return Review.findAll({
    order: [["id", "ASC"]],
  });
}

async function seedReviews(initialReviews = []) {
  const count = await Review.count();

  if (count > 0 || initialReviews.length === 0) {
    return;
  }

  await Review.bulkCreate(
    initialReviews.map((item) => ({
      author: item.author,
      text: item.text,
    })),
  );
}

module.exports = {
  getReviews,
  seedReviews,
};
