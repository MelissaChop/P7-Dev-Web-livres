const multer = require("multer");

// Dictionnaire des MiME_TYPES
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.memoryStorage();

module.exports = multer({ storage }).single("image");
