const express = require("express");
const bouquetController = require("../controllers/bouquetController");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const isEmptyBody = require("../middlewares/isEmptyBody");
const upload = require("../middlewares/upload");
const validateBody = require("../middlewares/validateBody");
const {
  createBouquetSchema,
  updateBouquetSchema,
  updateFavoriteSchema,
} = require("../schemas/bouquetSchemas");

const router = express.Router();

router.get("/", ctrlWrapper(bouquetController.listBouquets));
router.get("/bestsellers", ctrlWrapper(bouquetController.listBestsellers));
router.get("/:id", ctrlWrapper(bouquetController.getBouquet));
router.post(
  "/",
  validateBody(createBouquetSchema),
  ctrlWrapper(bouquetController.createBouquet),
);
router.put(
  "/:id",
  isEmptyBody,
  validateBody(updateBouquetSchema),
  ctrlWrapper(bouquetController.updateBouquet),
);
router.delete("/:id", ctrlWrapper(bouquetController.deleteBouquet));
router.patch(
  "/:id/favorite",
  validateBody(updateFavoriteSchema),
  ctrlWrapper(bouquetController.updateFavorite),
);
router.patch(
  "/:id/photo",
  upload.single("photo"),
  ctrlWrapper(bouquetController.updatePhoto),
);

module.exports = router;
