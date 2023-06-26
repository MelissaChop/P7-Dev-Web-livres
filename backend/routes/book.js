const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();

const bookCtrl = require("../controllers/book");

router.post("/", auth, multer, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.addRating);
router.get("/", auth, bookCtrl.getAllBook);
router.get("/:id", auth, bookCtrl.getOneBook);
router.get("/bestrating", auth, bookCtrl.getBestBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;

/*  FAIT */
