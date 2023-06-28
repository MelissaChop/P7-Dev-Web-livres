const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();

const bookCtrl = require("../controllers/book");

router.post("/", auth, multer, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.addRating);
router.get("/", bookCtrl.getAllBook);
router.get("/:id", bookCtrl.getOneBook);
/*router.get("/bestrating", bookCtrl.getBestBook);*/
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;

/*  FAIT */
