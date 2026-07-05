const express = require("express");
const reviewController = require("../controllers/reviewController");
const ctrlWrapper = require("../helpers/ctrlWrapper");

const router = express.Router();

router.get("/", ctrlWrapper(reviewController.listReviews));

module.exports = router;
