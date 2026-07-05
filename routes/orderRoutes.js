const express = require("express");
const orderController = require("../controllers/orderController");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const validateBody = require("../middlewares/validateBody");
const { createOrderSchema } = require("../schemas/orderSchemas");

const router = express.Router();

router.post(
  "/",
  validateBody(createOrderSchema),
  ctrlWrapper(orderController.createOrder),
);

module.exports = router;
