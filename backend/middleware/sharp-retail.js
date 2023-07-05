const sharp = require("sharp");

module.exports = (req, res, next) => {
  console.log(req.file);
  if (req.file) {
    const { originalname, buffer } = req.file;
    // Remplacer l'extension du fichier par .webp + donner nom Unique
    const name = originalname.split(" ").join("_");
    const fileName = name + "_" + Date.now() + ".webp";

    // Utiliser le module sharp pour convertir l'image en WebP
    sharp(buffer)
      .toFormat("webp")
      .resize(463, 595, { fit: "cover" })
      .toFile(`images/${fileName}`)

      .then(() => {
        req.file.fileName = fileName;

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
