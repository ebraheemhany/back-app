const express = require("express");
const route = express.Router();
const validateMiddleware = require("../../middleware/validate.middleware");
const { commentValidation } = require("../../config/validation");
const authMiddleware = require("../../middleware/auth.middleware");

const {
  createCommentController,
  getAllCommentsController,
  editCommentController,
  deleteCommentController,
} = require("./comment.controller");

route.post(
  "/posts/:postId/comments",
  authMiddleware,
  validateMiddleware(commentValidation),
  createCommentController,
);
route.get("/posts/:postId/comments", authMiddleware, getAllCommentsController);
route.put("/comments/:commentId", authMiddleware, editCommentController);
route.delete("/comments/:commentId", authMiddleware, deleteCommentController);
module.exports = route;
