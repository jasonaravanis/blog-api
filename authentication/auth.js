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
          message: "Username and password required",
          status: 401,
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
      await user.save();
      const tokenPayload = {
        username: req.body.username,
      };
      const token = jwt.sign({ tokenPayload }, process.env.JWT_SECRET);
      res.json(token);
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
        const tokenPayload = {
          username: user.username,
        };

        // generate a signed json web token with the contents of user object and return it in the response
        const token = jwt.sign({ tokenPayload }, process.env.JWT_SECRET);
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
          req.user = { ...user.user, iat: user.iat };
          return next();
        }
      }
    )(req, res, next);
  },
};
