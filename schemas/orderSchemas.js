const Joi = require("joi");

const createOrderSchema = Joi.object({
  bouquetId: Joi.number().integer().min(1).required(),
  quantity: Joi.number().integer().min(1).max(99).default(1),
  customerName: Joi.string().trim().min(2).max(120).required(),
  phone: Joi.string().trim().min(5).max(40).required(),
  address: Joi.string().trim().max(240).allow("", null),
  comment: Joi.string().trim().max(1000).allow("", null),
});

module.exports = {
  createOrderSchema,
};
