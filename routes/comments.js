const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");

// Requests for comments will typically be made in conjunction with a request for an article.
// So a request will be made with a specific articleID parameter in the request body.

// GET comments for an article
router.get("/", commentController.get_comments);

// POST a comment to an article
router.post("/", commentController.post_comment);

// PUT a comment (update a comment)
router.put("/:commentID", commentController.put_comment);

// DELETE a comment
router.delete("/:commentID", commentController.delete_comment);

module.exports = router;
