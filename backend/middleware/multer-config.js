const multer = require("multer");
/*const fs = require("fs");
const sharp = require("sharp");
const path = require("path");*/

// Dictionnaire des MiME_TYPES
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};
/*
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
module.exports = multer({ storage }).single("image");*/

const storage = multer.memoryStorage();

module.exports = multer({ storage }).single("image");
