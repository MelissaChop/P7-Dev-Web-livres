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
  // Chemin de sortie unique pour la version convertie
  const outputPath = file.replace(/\.[^.]+$/, ".webp");

  sharp(file)
    .webp()
    .toFile(outputPath, function (error, info) {
      if (error) {
        console.error("Erreur de conversion du fichier au format webp", error);
      } else {
        console.log("Image converti au format webp", info);
        // Suppression du fichier original après la conversion réussie
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }
    });
};

module.exports = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      // Gérer les erreurs lors du téléchargement du fichier
      return res
        .status(400)
        .json({
          error: "Une erreur s'est produite pendant le téléchargement.",
        });
    }

    if (req.file) {
      // Appeler la fonction de conversion si un fichier est présent
      convertToWebP(req.file.path);

      // Mise à jour du chemin du fichier dans la requête par le nouveau fichier converti
      req.file.path = req.file.path.replace(/\.[^.]+$/, ".webp");
    }

    // Passer à l'étape suivante du middleware
    next();
  });
};
