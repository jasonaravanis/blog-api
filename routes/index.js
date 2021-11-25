const express = require("express");
const router = express.Router();
const { signup, login, adminLogin } = require("../authentication/auth");
const debug = require("debug")("app:routes/login.js");

/* POST login */
router.post("/login", login);

/* POST Admin login */
router.post("/adminlogin", adminLogin);

/* POST sign-up */
router.post("/signup", signup);

module.exports = router;
