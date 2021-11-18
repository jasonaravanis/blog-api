const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, maxlength: 150 },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Article", ArticleSchema);
