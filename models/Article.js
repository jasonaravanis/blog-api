const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// commentSchema is a sub-schema that is only used to attach comment objects to article documents
// See more info here: https://mongoosejs.com/docs/subdocs.html
const commentSchema = new Schema({
  date: { type: Date, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true },
});

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, maxlength: 100 },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true },
  comments: [commentSchema],
});

module.exports = mongoose.model("Article", ArticleSchema);
