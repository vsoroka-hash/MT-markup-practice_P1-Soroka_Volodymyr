const HttpError = require("../helpers/HttpError");
const { Bouquet, Order } = require("../models");

async function createOrder(payload) {
  const bouquet = await Bouquet.findByPk(payload.bouquetId);

  if (!bouquet) {
    throw HttpError(404, "Bouquet not found");
  }

  return Order.create({
    bouquetId: bouquet.id,
    bouquetTitle: bouquet.title,
    quantity: payload.quantity,
    customerName: payload.customerName,
    phone: payload.phone,
    address: payload.address || null,
    comment: payload.comment || null,
  });
}

module.exports = {
  createOrder,
};
