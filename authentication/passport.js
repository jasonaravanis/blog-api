const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
const debug = require("debug")("app:authentication/passport.js");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(function (username, password, cb) {
      User.findOne({ username }).exec((err, user) => {
        if (err) {
          return cb(err);
        } else if (!user) {
          return cb(null, false, { message: "Username not found" });
        } else {
          // TODO: Check this works after implement hashing on sign up
          bcrypt.compare(user.password, password, (err, result) => {
            debug(err, result);
            if (err) {
              return cb(err);
            } else if (!result) {
              return cb(null, false, { message: "Incorrect password" });
            } else {
              return cb(null, user, { message: "You are now logged in" });
            }
          });
        }
      });
    })
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "your_jwt_secret",
      },
      function (jwtPayload, cb) {
        if (jwtPayload) {
          return cb(null, jwtPayload);
        } else {
          return cb(null, false);
        }
      }
    )
  );
};
