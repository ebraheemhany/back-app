const express = require("express");
const route = express.Router();
const authMiddelware = require("../../middleware/auth.middleware");
const { upload } = require("../../config/cloudinary");
const {
  createStoryContorller,
  getStoriesController,
  viewStoryController,
  getStoryViewsController,
  deleteStoryController,
} = require("./story.controller");

route.post(
  "/stories",
  authMiddelware,
  upload.single("media"),
  createStoryContorller,
);
route.get("/stories", authMiddelware, getStoriesController);
route.post("/stories/:storyId/view", authMiddelware, viewStoryController);
route.get("/stories/:storyId/views", authMiddelware, getStoryViewsController);
route.delete("/stories/:storyId", authMiddelware, deleteStoryController);
module.exports = route;
  