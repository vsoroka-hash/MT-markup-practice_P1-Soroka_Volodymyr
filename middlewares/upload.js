const multer = require("multer");
const path = require("path");
const HttpError = require("../helpers/HttpError");

const tempDir = path.join(process.cwd(), "temp");

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!imageMimeTypes.has(file.mimetype)) {
      cb(HttpError(400, "Only image files are allowed"));
      return;
    }

    cb(null, true);
  },
});

module.exports = upload;
