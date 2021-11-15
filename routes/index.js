const express = require("express");
const router = express.Router();
const { signup, login } = require("../authentication/auth");
const debug = require("debug")("app:routes/login.js");

/* POST login */
router.post("/login", login);

/* POST sign-up */
router.post("/signup", signup);

module.exports = router;
