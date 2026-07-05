const orderService = require("../services/orderService");

async function createOrder(req, res) {
  const order = await orderService.createOrder(req.body);
  res.status(201).json(order);
}

module.exports = {
  createOrder,
};
