const debug = require("debug")("app:/routes/articles.js");
const express = require("express");
const articleController = require("../controllers/article");
const router = express.Router();
const { ensureAuthenticated } = require("../authentication/auth");

// GET all articles
router.get("/", ensureAuthenticated, articleController.get_articles);

// POST an article
router.post("/", articleController.post_article);

// GET a specific article
router.get("/:articleID", articleController.get_article);

// PUT an article (update an article)
router.put("/:articleID", articleController.put_article);

// DELETE an article
router.delete("/:articleID", articleController.delete_article);

module.exports = router;
