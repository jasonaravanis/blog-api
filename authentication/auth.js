const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const debug = require("debug")("app:/authentication/auth.js");

module.exports = {
  signup: async function (req, res, next) {
    try {
      if (!req.body.username || !req.body.password) {
        const error = {
          status: "Username and password required",
          message: 401,
        };
        return next(error);
      }

      const existingUser = await User.findOne({
        username: req.body.username,
      }).exec();

      if (existingUser) {
        const alert = {
          message:
            "That username is already in use. Please pick a different username.",
        };
        res.status(200).json(alert);
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      const newUser = await user.save();
      res.json(newUser);
    } catch (err) {
      return next(err);
    }
  },
  login: function (req, res, next) {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = {
          status: 401,
          message: info.message,
        };
        return next(error);
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        // generate a signed json web token with the contents of user object and return it in the response
        const token = jwt.sign({ user }, "your_jwt_secret");
        return res.json({ user, token });
      });
    })(req, res, next);
  },
  ensureAuthenticated: function (req, res, next) {
    passport.authenticate(
      "jwt",
      { session: false },
      function (err, user, info) {
        if (!user || err) {
          const error = {};
          error.message = info.message;
          error.status = 401;
          return next(error);
        } else {
          return next();
        }
      }
    )(req, res, next);
  },
};
