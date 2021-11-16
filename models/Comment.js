const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  date: { type: Date, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  article: { type: Schema.Types.ObjectId, required: true, ref: "Article" },
});

module.exports = mongoose.model("Comment", CommentSchema);
