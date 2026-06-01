const express = require("express");
const route = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const {
  createFollowController,
  getFollowersController,
  getFollowingController,
  getFollowStatsController,
  isFollowingController,
} = require("./follow.controller");

route.post("/users/:userId/follow", authMiddleware, createFollowController);
route.get("/users/:userId/followers", authMiddleware, getFollowersController);
route.get("/users/:userId/following", authMiddleware, getFollowingController);
route.get(
  "/users/:userId/follow-stats",
  authMiddleware,
  getFollowStatsController,
);
route.get("/users/:userId/is-following", authMiddleware, isFollowingController);
module.exports = route;
