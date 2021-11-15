const passport = require("passport");
const debug = require("debug")("app:/authentication/auth.js");

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    passport.authenticate(
      "jwt",
      { session: false },
      function (err, user, info) {
        if (!user || err) {
          res.json({ error: info.message });
        } else {
          return next();
        }
      }
    )(req, res, next);
  },
};
