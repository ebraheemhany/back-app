const express = require("express");
const route = express.Router();
const validateMiddleware = require("../../middleware/validate.middleware");
const { postValidation } = require("../../config/validation");
const { upload } = require("../../config/cloudinary");
const {
  createPostController,
  deletePostController,
  getAllPostsController,
  updatePostController,
  searchPostcontroller,
  getPostsByUserIdController,
} = require("./post.controller");
const authMiddleware = require("../../middleware/auth.middleware");
route.post(
  "/posts",
  authMiddleware,
  upload.single("media"),
  validateMiddleware(postValidation),
  createPostController,
);
route.delete("/posts/:postId", authMiddleware, deletePostController);
route.get("/posts", getAllPostsController);
route.put(
  "/posts/:postId",
  authMiddleware,
  upload.single("media"),
  updatePostController,
);
route.get("/posts/search", authMiddleware, searchPostcontroller);
route.get("/posts/user/:userId", authMiddleware, getPostsByUserIdController);
module.exports = route;
