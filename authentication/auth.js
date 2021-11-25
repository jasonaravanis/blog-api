const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const debug = require("debug")("app:/authentication/auth.js");

module.exports = {
  signup: async function (req, res, next) {
    try {
      if (!req.body.username || !req.body.password) {
        const info = {
          message: "Username and password required",
          status: 200,
        };
        return res.send(info);
      }

      const existingUser = await User.findOne({
        username: req.body.username,
      }).exec();

      if (existingUser) {
        const info = {
          statusCode: 200,
          message:
            "That username is already in use. Please pick a different username.",
        };
        return res.send(info);
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        isAdmin: false,
      });

      const profileImage = `https://avatars.dicebear.com/api/croodles/${user._id}.svg`;

      user.profileImage = profileImage;

      await user.save();
      const tokenPayload = {
        username: req.body.username,
        profileImage,
        _id: user._id,
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
      if (info) {
        return res.send(info);
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        const tokenPayload = {
          username: user.username,
          profileImage: user.profileImage,
          isAdmin: user.isAdmin,
          _id: user._id,
        };

        // generate a signed json web token with the contents of user object and return it in the response
        const token = jwt.sign({ tokenPayload }, process.env.JWT_SECRET);
        return res.json(token);
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
          req.user = { ...user.tokenPayload, iat: user.iat };
          return next();
        }
      }
    )(req, res, next);
  },
  ensureAdmin: function (req, res, next) {
    if (!req.user.isAdmin) {
      const info = {};
      info.message = "This account does not have administrator credentials";
      res.send(info);
    } else {
      return next();
    }
  },
};
