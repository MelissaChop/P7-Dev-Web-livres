const multer = require("multer");

// Dictionnaire des MiME_TYPES
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  // La destination de stockage du fichier
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // supprimer espaces dans le nom du fichier
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.minetype];

    callback(null, name + "_" + Date.now() + extension);
  },
});

console.log(storage);

module.exports = multer({ storage }).single("image");
