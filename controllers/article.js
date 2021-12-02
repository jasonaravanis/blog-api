const Article = require("../models/Article");
const Comment = require("../models/Comment");
const { body, validationResult } = require("express-validator");
const debug = require("debug")("app:controllers/article.js");

// TODO: Add html parsing to prevent XSS attacks. Previously removed '.escape()' from article content validation in 'validateArticleInput' middleware
// in order to enable html to be parsed on client side with correct styling.

const validateArticleInput = [
  body("title")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Article title required")
    .isLength({ max: 100 })
    .escape(),
  body("description")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Article description required")
    .isLength({ max: 150 })
    .escape(),
  body("content")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Article content required"),
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.json({
        formInput: req.body,
        errors: validationErrors.array(),
      });
    } else {
      return next();
    }
  },
];

exports.get_published_articles = async (req, res, next) => {
  try {
    const articles = await Article.find({ isPublished: true })
      .populate("author", "username profileImage")
      .exec();
    return res.json(articles);
  } catch (err) {
    next(err);
  }
};

exports.get_articles = async (req, res, next) => {
  try {
    const articles = await Article.find()
      .populate("author", "username profileImage")
      .exec();
    return res.json(articles);
  } catch (err) {
    next(err);
  }
};

exports.post_article = [
  validateArticleInput,
  async (req, res, next) => {
    try {
      const article = await new Article({
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        author: req.user._id,
        date: Date.now(),
        isPublished:
          typeof req.body.isPublished === "undefined"
            ? true
            : req.body.isPublished,
      }).save();

      return res.json(article);
    } catch (err) {
      next(err);
    }
  },
];

exports.get_article = async (req, res, next) => {
  try {
    const articleID = req.params.articleID;
    const article = await Article.findById(articleID)
      .populate("author", "username profileImage")
      .exec();
    return res.json(article);
  } catch (err) {
    next(err);
  }
};

exports.put_article = [
  validateArticleInput,
  async (req, res, next) => {
    try {
      const articleID = req.params.articleID;
      const article = await Article.findById(articleID);
      if (req.user._id != article.author) {
        return res.json({
          message: "Only original author or admin can edit articles.",
        });
      }
      const articleFields = Object.keys(Article.schema.paths);
      articleFields.map((field) => {
        if (field in req.body) {
          article[field] = req.body[field];
        }
      });
      const updatedArticle = await article.save();
      return res.json(updatedArticle);
    } catch (err) {
      next(err);
    }
  },
];

exports.delete_article = async (req, res, next) => {
  // TODO: Make sure all article comments are deleted when an article is deleted.
  try {
    const articleID = req.params.articleID;
    const article = await Article.findById(articleID).exec();
    if (req.user._id != article.author) {
      return res.json({
        message: "Only original author or admin can edit articles.",
      });
    }
    const confirmation = await Article.findByIdAndDelete(articleID);
    if (confirmation) {
      await Comment.deleteMany({ article: articleID });
    }
    return res.json(confirmation);
  } catch (err) {
    next(err);
  }
};
