const gravatar = require("gravatar");
const { Op } = require("sequelize");
const { Bouquet } = require("../models");

function buildPhotoURL(title) {
  return gravatar.url(
    `${title}@flora.local`,
    {
      s: "600",
      d: "identicon",
      r: "pg",
    },
    true,
  );
}

async function getAllBouquets({ page, limit, title } = {}) {
  const where = {};

  if (title) {
    where.title = {
      [Op.iLike]: `%${title}%`,
    };
  }

  const options = {
    where,
    order: [["id", "ASC"]],
  };

  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.max(Number(limit) || 0, 0);

  if (normalizedLimit > 0) {
    options.limit = normalizedLimit;
    options.offset = (normalizedPage - 1) * normalizedLimit;
  }

  const { count, rows } = await Bouquet.findAndCountAll(options);
  const loaded = options.offset ? options.offset + rows.length : rows.length;

  return {
    data: rows,
    total: count,
    page: normalizedPage,
    limit: normalizedLimit || count,
    hasMore: loaded < count,
  };
}

async function getBestsellers(limit = 6) {
  const favoriteBouquets = await Bouquet.findAll({
    where: { favorite: true },
    order: [["id", "ASC"]],
    limit: Number(limit),
  });

  if (favoriteBouquets.length > 0) {
    return favoriteBouquets;
  }

  return Bouquet.findAll({
    order: [["id", "ASC"]],
    limit: Number(limit),
  });
}

function getBouquetById(id) {
  return Bouquet.findByPk(id);
}

function createBouquet(payload) {
  return Bouquet.create({
    ...payload,
    photoURL: payload.photoURL || buildPhotoURL(payload.title),
  });
}

async function updateBouquet(id, payload) {
  const bouquet = await Bouquet.findByPk(id);

  if (!bouquet) {
    return null;
  }

  return bouquet.update(payload);
}

async function deleteBouquet(id) {
  const bouquet = await Bouquet.findByPk(id);

  if (!bouquet) {
    return null;
  }

  await bouquet.destroy();
  return bouquet;
}

async function seedBouquets(initialBouquets = []) {
  const count = await Bouquet.count();

  if (count > 0 || initialBouquets.length === 0) {
    return;
  }

  await Bouquet.bulkCreate(
    initialBouquets.map((item, index) => ({
      title: item.title,
      description: item.description,
      price: item.price,
      favorite: index < 6,
      photoURL:
        item.photoURL ||
        `${process.env.PUBLIC_BACKEND_URL || ""}/images/${item.imageBase}-1x.jpg`,
    })),
  );
}

module.exports = {
  getAllBouquets,
  getBestsellers,
  getBouquetById,
  createBouquet,
  updateBouquet,
  deleteBouquet,
  seedBouquets,
};
