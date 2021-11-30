const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");
const { ensureAuthenticated, ensureAdmin } = require("../authentication/auth");

// Requests for comments will typically be made in conjunction with a request for an article.
// So a request will be made with a specific articleID parameter in the request body.

// GET comments for an article
router.get("/", commentController.get_comments);

// POST a comment to an article
router.post("/", ensureAuthenticated, commentController.post_comment);

// PUT a comment (update a comment)
router.put("/:commentID", ensureAuthenticated, commentController.put_comment);

// DELETE a comment
router.delete(
  "/:commentID",
  ensureAuthenticated,
  ensureAdmin,
  commentController.delete_comment
);

module.exports = router;
