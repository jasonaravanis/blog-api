const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const debug = require("debug")("app:routes/login.js");

/* POST login. */
router.post("/", function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      // generate a signed json web token with the contents of user object and return it in the response
      const token = jwt.sign({ user }, "your_jwt_secret");
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;
