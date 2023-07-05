const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();
const { convertToWebp } = require("../middleware/multer-config");

const bookCtrl = require("../controllers/book");

router.post("/", auth, multer, convertToWebp, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.addRating);
router.put("/:id", auth, multer, convertToWebp, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/bestrating", bookCtrl.getBestBooks);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.getAllBook);

module.exports = router;

/*  FAIT */
