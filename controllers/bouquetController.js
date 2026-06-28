const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");
const HttpError = require("../helpers/HttpError");
const bouquetService = require("../services/bouquetService");

async function listBouquets(req, res) {
  const bouquets = await bouquetService.getAllBouquets(req.query);
  res.status(200).json(bouquets);
}

async function listBestsellers(req, res) {
  const bouquets = await bouquetService.getBestsellers(req.query.limit);
  res.status(200).json(bouquets);
}

async function getBouquet(req, res) {
  const bouquet = await bouquetService.getBouquetById(req.params.id);

  if (!bouquet) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(bouquet);
}

async function createBouquet(req, res) {
  const bouquet = await bouquetService.createBouquet(req.body);
  res.status(201).json(bouquet);
}

async function updateBouquet(req, res) {
  const bouquet = await bouquetService.updateBouquet(req.params.id, req.body);

  if (!bouquet) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(bouquet);
}

async function deleteBouquet(req, res) {
  const bouquet = await bouquetService.deleteBouquet(req.params.id);

  if (!bouquet) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(bouquet);
}

async function updateFavorite(req, res) {
  const bouquet = await bouquetService.updateBouquet(req.params.id, req.body);

  if (!bouquet) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(bouquet);
}

async function updatePhoto(req, res) {
  if (!req.file) {
    throw HttpError(400, "Photo file is required");
  }

  const bouquet = await bouquetService.getBouquetById(req.params.id);

  if (!bouquet) {
    await fs.unlink(req.file.path).catch(() => {});
    throw HttpError(404, "Not found");
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const filename = `${randomUUID()}${ext}`;
  const destination = path.join(process.cwd(), "public", "photos", filename);

  await fs.rename(req.file.path, destination);

  const publicBackendUrl = process.env.PUBLIC_BACKEND_URL;
  const origin = publicBackendUrl || `${req.protocol}://${req.get("host")}`;
  const photoURL = `${origin}/photos/${filename}`;
  const updatedBouquet = await bouquet.update({ photoURL });

  res.status(200).json(updatedBouquet);
}

module.exports = {
  listBouquets,
  listBestsellers,
  getBouquet,
  createBouquet,
  updateBouquet,
  deleteBouquet,
  updateFavorite,
  updatePhoto,
};
