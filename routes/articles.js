const debug = require("debug")("app:/routes/articles.js");
const express = require("express");
const articleController = require("../controllers/article");
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require("../authentication/auth");

// GET all published articles (public view)
router.get("/", articleController.get_articles);

// POST an article
router.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  articleController.post_article
);

// GET a specific article
router.get("/:articleID", articleController.get_article);

// PUT an article (update an article)
router.put(
  "/:articleID",
  ensureAuthenticated,
  ensureAdmin,
  articleController.put_article
);

// DELETE an article
router.delete(
  "/:articleID",
  ensureAuthenticated,
  ensureAdmin,
  articleController.delete_article
);

module.exports = router;
