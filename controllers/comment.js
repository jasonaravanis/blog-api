const Comment = require("../models/Comment");
const { body, validationResult } = require("express-validator");
const debug = require("debug")("app:controllers/comment.js");

const validateCommentInput = [
  body("content")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Comment can not be empty.")
    .isLength({ max: 250 })
    .withMessage("Maximum comment length is 250 characters")
    .escape(),
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.json({
        formInput: req.body,
        errors: validationErrors.array(),
      });
    } else {
      next();
    }
  },
];

exports.get_comments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      article: req.query.articleID,
    })
      .populate("author", "username profileImage")
      .sort({ date: "desc" })
      .exec();
    res.json(comments);
  } catch (err) {
    return next(err);
  }
};

exports.post_comment = [
  validateCommentInput,
  async (req, res, next) => {
    try {
      const comment = new Comment({
        date: Date.now(),
        content: req.body.content,
        author: req.user._id,
        article: req.body.article,
      });
      const doc = await comment.save();
      return res.json(doc);
    } catch (err) {
      return next(err);
    }
  },
];

exports.put_comment = [
  validateCommentInput,
  async (req, res, next) => {
    // The only updatable field for a comment is the content. Author, article, and date must remain unchanged.
    try {
      const comment = await Comment.findById(req.params.commentID).exec();
      if (req.user._id != comment.author) {
        return res.json({
          message:
            "Update failed, only comment author can update this comment.",
        });
      }
      if (req.body.content) {
        comment.content = req.body.content;
      }
      const updatedComment = await comment.save();
      return res.json(updatedComment);
    } catch (err) {
      return next(err);
    }
  },
];

exports.delete_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentID).exec();
    if (req.user._id != comment.author) {
      return res.json({
        message:
          "Delete failed, only comment author or admin can remove this comment.",
      });
    }
    const confirmation = await Comment.deleteOne({
      id: req.params.commentID,
    }).exec();

    return res.json(confirmation);
  } catch (err) {
    return next(err);
  }
};
