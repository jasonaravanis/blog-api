const Comment = require("../models/Comment");

exports.get_comments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      article: req.body.article,
    }).exec();
    res.json(comments);
  } catch (err) {
    return next(err);
  }
};

exports.post_comment = async (req, res, next) => {
  try {
    const comment = new Comment({
      date: Date.now(),
      content: req.body.content,
      author: req.body.author,
      article: req.body.article,
    });
    const doc = await comment.save();
    res.json(doc);
  } catch (err) {
    return next(err);
  }
};

exports.put_comment = async (req, res, next) => {
  // The only updatable field for a comment is the content.
  // Author, article, and date must remain unchanged.
  try {
    const comment = await Comment.findById(req.params.commentID).exec();
    if (req.body.content) {
      comment.content = req.body.content;
    }
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (err) {
    return next(err);
  }
};

exports.delete_comment = async (req, res, next) => {
  try {
    const confirmation = await Comment.deleteOne({
      id: req.params.commentID,
    }).exec();
    res.json(confirmation);
  } catch (err) {
    return next(err);
  }
};
