const Article = require("../models/Article");
const debug = require("debug")("app:controllers/article.js");

exports.get_articles = (req, res, next) => {
  Article.find().exec((err, articles) => {
    if (err) {
      res.json(err);
    } else {
      res.json({
        message: "Recieved request to GET ARTICLES (all articles)",
        articles,
      });
    }
  });
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
    res.json(err);
  }
};

exports.get_article = (req, res, next) => {
  const articleID = req.params.articleID;
  Article.findById(articleID).exec((err, article) => {
    if (err) {
      next(err);
    } else {
      res.json({
        message: `Recieved GET request for ARTICLE with ID of: ${articleID}`,
        article,
      });
    }
  });
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
    res.json(err);
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
    res.json(err);
  }
};
