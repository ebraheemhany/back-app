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
  getTrendingPostsController,
  getPostByIdController,
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
route.get("/posts", authMiddleware, getAllPostsController);
route.put(
  "/posts/:postId",
  authMiddleware,
  upload.single("media"),
  updatePostController,
);
route.get("/posts/search", authMiddleware, searchPostcontroller);
route.get("/posts/user/:userId", authMiddleware, getPostsByUserIdController);
route.get("/posts/trending", authMiddleware, getTrendingPostsController);
route.get("/posts/:id", authMiddleware, getPostByIdController);
module.exports = route;
