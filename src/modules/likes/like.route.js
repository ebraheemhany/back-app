const express = require("express");
const route = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const {
  getPostLikesController,
  createLikesController,
} = require("./like.controller");

route.post("/posts/:postId/like", authMiddleware, createLikesController);
route.get("/posts/:postId/likes", authMiddleware, getPostLikesController);

module.exports = route;
