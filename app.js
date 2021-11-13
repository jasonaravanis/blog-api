const debug = require("debug")("app");
require("dotenv").config();
const express = require("express");

const app = express();

app.listen(process.env.PORT, () => {
  debug(`'blog-api' listening on port ${process.env.PORT}`);
});
