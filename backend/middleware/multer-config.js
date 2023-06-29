const multer = require("multer");
const sharp = require("sharp");
const express = require("express");

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
    callback(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({ storage: storage }).single("image");

const convertToWebP = (file) => {
  sharp(file)
    .webp()
    .toFile("file.webp", function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
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
    }

    // Passer à l'étape suivante du middleware
    next();
  });
};
/*  A CORRIGER*/
