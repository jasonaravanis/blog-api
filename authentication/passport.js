const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
const debug = require("debug")("app:authentication/passport.js");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async function (username, password, cb) {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return cb(null, false, { message: "Username not found" });
        }
        const loginSuccess = await bcrypt.compare(password, user.password);
        if (loginSuccess) {
          return cb(null, user, { message: "You are now logged in" });
        } else {
          return cb(null, false, { message: "Incorrect password" });
        }
      } catch (err) {
        return cb(err);
      }
    })
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
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
