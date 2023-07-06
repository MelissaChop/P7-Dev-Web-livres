const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  /*FAIT*/
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.fileName
    }`,
    averageRating: 0,
    ratings: [],
  });
  /*console.log(req.file);*/

  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  /*FAIT*/
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json(error));
};

exports.modifyBook = (req, res, next) => {
  /*FAIT*/
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.fileName
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: "Non autorisé!" });
      } else {
        const imageToDelete = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${imageToDelete}`, () => {
          Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Livre modifié!" }))
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  /*FAIT*/
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé!" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllBook = (req, res, next) => {
  /*FAIT*/
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.addRating = (req, res, next) => {
  /*FAIT*/
  const rating = parseFloat(req.body.rating);

  // Vérification de la plage de note
  if (rating < 0 || rating > 5 || isNaN(rating)) {
    return res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5." });
  }
  /*console.log(req.params.id);
  console.log(rating);*/

  Book.findOne({ _id: req.params.id })
    .then((Book) => {
      if (!Book) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }
      // Vérification si l'utilisateur a déjà noté ce livre
      const existingRating = Book.ratings.find(
        (r) => r.userId === req.auth.userId
      );

      if (existingRating) {
        return res
          .status(409)
          .json({ message: "L'utilisateur a déjà noté ce livre." });
      } else {
        // Ajout de la note et mise à jour de la moyenne
        const totalRating = Book.ratings.reduce((acc, r) => acc + r.grade, 0);
        const newTotalRating = totalRating + rating;
        const averageRating = newTotalRating / (Book.ratings.length + 1);

        /* console.log(rating);*/

        Book.ratings.push({ userId: req.auth.userId, grade: rating });
        Book.averageRating = averageRating;

        Book.save()
          .then((updatedBook) => {
            res.status(200).json(updatedBook);
          })
          .catch((error) => {
            res.status(409).json({ error });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

exports.getBestBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((bestBooks) => res.status(200).json(bestBooks))
    .catch((error) =>
      res.status(500).json({ error: "Une erreur s'est produite" })
    );
};

/* FAIT*/
