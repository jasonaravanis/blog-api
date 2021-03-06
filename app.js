const debug = require("debug")("app:app.js");
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");
const cors = require("cors");

// Express Initialisation
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors());

// Mongoose
(async () => {
  try {
    mongoose.connection.on("error", (err) => debug(err));
    mongoose.connection.on("connecting", () => debug("Mongoose connecting..."));
    mongoose.connection.on("connected", () => debug("Mongoose connected"));
    mongoose.connection.on("disconnected", () =>
      debug("Mongoose disconnected")
    );
    await mongoose.connect(
      `mongodb+srv://admin:${process.env.MONGODB_PW}@cluster0.a6gzm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    );
  } catch (error) {
    debug(`MONGOOSE ERROR:`);
    debug(error);
  }
})();

// Passport
require("./authentication/passport")(passport);
app.use(passport.initialize());

// Routes
app.use("/", require("./routes/index"));
app.use("/articles", require("./routes/articles"));
app.use("/comments", require("./routes/comments"));

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status);
  res.send(err);
});

app.listen(process.env.PORT, () => {
  debug(`'blog-api' listening on port ${process.env.PORT}`);
});
