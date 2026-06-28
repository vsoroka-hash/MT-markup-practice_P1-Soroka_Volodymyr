const Joi = require("joi");

const title = Joi.string().trim().min(2).max(120);
const description = Joi.string().trim().min(10).max(1000);
const price = Joi.number().integer().min(1);
const favorite = Joi.boolean();
const photoURL = Joi.string().uri();

const createBouquetSchema = Joi.object({
  title: title.required(),
  description: description.required(),
  price: price.required(),
  favorite,
  photoURL,
});

const updateBouquetSchema = Joi.object({
  title,
  description,
  price,
  favorite,
  photoURL,
}).min(1);

const updateFavoriteSchema = Joi.object({
  favorite: favorite.required(),
});

module.exports = {
  createBouquetSchema,
  updateBouquetSchema,
  updateFavoriteSchema,
};
