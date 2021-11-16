const Article = require("../models/Article");
const { body, validationResult } = require("express-validator");
const debug = require("debug")("app:controllers/article.js");

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
    .isLength({ max: 100 })
    .escape(),
  body("content")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Article content required")
    .escape(),
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

exports.get_articles = async (req, res, next) => {
  try {
    const articles = await Article.find().exec();
    res.json({
      message: "Recieved request to GET ARTICLES (all articles)",
      articles,
    });
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
      }).save();

      res.json(article);
    } catch (err) {
      next(err);
    }
  },
];

exports.get_article = async (req, res, next) => {
  try {
    const articleID = req.params.articleID;
    const article = await Article.findById(articleID).exec();
    res.json({
      message: `Recieved GET request for ARTICLE with ID of: ${articleID}`,
      article,
    });
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
      if (req.user.id != article.author) {
        return res.json({
          message: "Only original author or admin can edit articles.",
        });
      }
      const articleFields = Object.keys(Article.schema.paths);
      articleFields.map((field) => {
        if (req.body[field]) {
          article[field] = req.body[field];
        }
      });
      const updatedArticle = await article.save();
      res.json({
        message: `Recieved PUT request to update the ARTICLE with ID of: ${articleID}`,
        article: updatedArticle,
      });
    } catch (err) {
      next(err);
    }
  },
];

exports.delete_article = async (req, res, next) => {
  try {
    const articleID = req.params.articleID;
    const article = await Article.findById(articleID).exec();
    if (req.user.id != article.author) {
      return res.json({
        message: "Only original author or admin can edit articles.",
      });
    }
    const confirmation = await Article.deleteOne({ id: articleID });
    res.json({
      message: `Recieved DELETE request for ARTICLE with ID of: ${articleID}`,
      confirmation,
    });
  } catch (err) {
    next(err);
  }
};
