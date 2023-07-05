const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

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
    console.log("Toto");
  },
  filename: (req, file, callback) => {
    // supprimer espaces dans le nom du fichier
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];

    callback(null, name + "_" + Date.now() + "." + extension);
  },
});

console.log(storage);

module.exports = multer({ storage }).single("image");

const convertToWebp = (req, res, next) => {
  if (req.file && req.file.path) {
    const originalImagePath = req.file.path;
    const newFile = req.file.path.replace(/\.[^.]+$/, ".webp");

    sharp(originalImagePath)
      .toFormat("webp")
      .toFile(newFile)
      .then(() => {
        if (fs.existsSync(originalImagePath)) {
          fs.unlinkSync(originalImagePath);
          console.log("Tata");
        }

        const parsedPath = path.parse(newFile);
        const relativePath = path.join(
          parsedPath.dir,
          parsedPath.name + ".webp"
        );
        req.file.path = relativePath.replace(/\\/g, "/");

        next();
      })
      .catch((error) => {
        console.error(error);
        next();
      });
  } else {
    next();
  }
};
console.log(convertToWebp);

module.exports.convertToWebp = convertToWebp;
