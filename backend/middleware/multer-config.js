const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    const uniqueFileName = `${name}_${Date.now()}.${extension}`;
    callback(null, uniqueFileName);
  },
});

const upload = multer({ storage }).single("image");

/* Conversion au format .webp*/

const convertToWebP = (file) => {
  const outputPath = file.replace(/\.[^.]+$/, ".webp"); // Chemin de sortie unique pour la version convertie

  sharp(file)
    .webp()
    .toFile(outputPath, function (err, info) {
      if (err) {
        console.error("Error converting image to webp:", err);
      } else {
        console.log("Image converted to webp:", info);
        // Suppression du fichier original après la conversion réussie
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }
    });
};

module.exports = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // Gérer les erreurs lors du téléchargement du fichier
      return res
        .status(400)
        .json({ error: "An error occurred during upload." });
    }

    if (req.file) {
      // Appeler la fonction de conversion si un fichier est présent
      convertToWebP(req.file.path);

      // Mise à jour du chemin du fichier dans la requête pour refléter le nouveau fichier converti
      req.file.path = req.file.path.replace(/\.[^.]+$/, ".webp");
    }

    // Passer à l'étape suivante du middleware
    next();
  });
};
