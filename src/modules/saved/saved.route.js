const express = require("express");
const route = express.Router();
const {
  toggleSavePostController,
  getSavedPostsController,
} = require("./saved.controller");
const authMiddleware = require("../../middleware/auth.middleware");

route.post("/posts/:postId/save", authMiddleware, toggleSavePostController);
route.get("/saved-posts", authMiddleware, getSavedPostsController);

module.exports = router;
