const express = require("express");
const router = express.Router();
const passwordValidator = require("../middleware/passwordValidator");
const login = require("../middleware/limiter");

const userCtrl = require("../controllers/user");

router.post("/signup", passwordValidator, userCtrl.signup);
router.post("/login", login.limiter, userCtrl.login);

module.exports = router;

/* FIN */
