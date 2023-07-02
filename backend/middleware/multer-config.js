const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const bookCtrl = require("../controllers/book");

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

// Fonction pour convertir en WebP (retourne une promesse)
const convertToWebP = (file) => {
  return new Promise((resolve, reject) => {
    // Chemin de sortie unique pour la version convertie
    const outputPath = file.replace(/\.[^.]+$/, ".webp");

    sharp(file)
      .webp()
      .toFile(outputPath, function (error, info) {
        if (error) {
          console.error(
            "Erreur de conversion du fichier au format WebP",
            error
          );
          reject(error);
        } else {
          console.log("Image convertie au format WebP", info);
          // Suppression du fichier original après la conversion réussie
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
          resolve(outputPath);
        }
      });
  });
};

const router = express.Router();

// Route pour créer un livre
router.post("/", auth, upload, async (req, res, next) => {
  // Assurez-vous que req.file contient bien le chemin de l'image après le téléchargement
  if (req.file) {
    try {
      // Appeler la fonction de conversion en WebP
      const webpPath = await convertToWebP(req.file.path);

      // Mise à jour du chemin du fichier
      req.file.path = webpPath;
    } catch (error) {
      // Gérer les erreurs de conversion en WebP
      return res.status(500).json({ error: "Erreur de conversion en WebP" });
    }
  }

  // Passer à la fonction de votre contrôleur pour créer le livre
  bookCtrl.createBook(req, res, next);
});

// Vos autres routes pour gérer les livres

module.exports = router;
