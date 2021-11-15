const Article = require("../models/Article");
const debug = require("debug")("app:controllers/article.js");

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

exports.post_article = async (req, res, next) => {
  try {
    const article = await new Article({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.body.author,
      date: Date.now(),
    }).save();

    res.json(article);
  } catch (err) {
    next(err);
  }
};

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

exports.put_article = async (req, res, next) => {
  try {
    const articleID = req.params.articleID;
    const article = await Article.findById(articleID);
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
};

exports.delete_article = async (req, res, next) => {
  try {
    const articleID = req.params.articleID;
    const confirmation = await Article.deleteOne({ id: articleID });
    res.json({
      message: `Recieved DELETE request for ARTICLE with ID of: ${articleID}`,
      confirmation,
    });
  } catch (err) {
    next(err);
  }
};
