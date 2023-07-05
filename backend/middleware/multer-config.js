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
    // Enregistrer les fichiers dans le dossier "images"
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // supprimer espaces dans le nom du fichier
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];

    // Construire le nom final du fichier
    callback(null, name + "_" + Date.now() + "." + extension);
  },
});

console.log(storage);

// Créer le middleware Multer pour gérer le téléchargement d'un seul fichier "image"
module.exports = multer({ storage }).single("image");

const convertToWebp = (req, res, next) => {
  if (req.file && req.file.path) {
    const originalImagePath = req.file.path;
    // Remplacer l'extension du fichier par .webp
    const newFile = req.file.path.replace(/\.[^.]+$/, ".webp");

    // Utiliser le module sharp pour convertir l'image en WebP
    sharp(originalImagePath)
      .toFormat("webp")
      .toFile(newFile)
      .then(() => {
        // Supprimer l.image d'origine après la conversion
        if (fs.existsSync(originalImagePath)) {
          fs.unlinkSync(originalImagePath);
        }

        // Mettre à jour le chemin du fichier dans la requête
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

// Exporter la fonction de conversion en WebP
module.exports.convertToWebp = convertToWebp;
