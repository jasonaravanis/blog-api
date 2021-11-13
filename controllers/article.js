exports.get_articles = (req, res, next) => {
  res.json({
    message: "Recieved request to GET ARTICLES (all articles)",
  });
};

exports.post_article = (req, res, next) => {
  res.json({
    message: "Recieved POST request to POST ARTICLE",
  });
};

exports.get_article = (req, res, next) => {
  const articleID = req.params.articleID;
  res.json({
    message: `Recieved GET request for ARTICLE with ID of: ${articleID}`,
  });
};

exports.put_article = (req, res, next) => {
  const articleID = req.params.articleID;
  res.json({
    message: `Recieved PUT request to update the ARTICLE with ID of: ${articleID}`,
  });
};

exports.delete_article = (req, res, next) => {
  const articleID = req.params.articleID;
  res.json({
    message: `Recieved DELETE request for ARTICLE with ID of: ${articleID}`,
  });
};
