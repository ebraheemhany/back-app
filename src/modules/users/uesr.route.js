const express = require("express");
const route = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const { upload } = require("../../config/cloudinary");
const {
  getUserProfileController,
  updateUserProfileController,
  uploadProfileImageController,
} = require("./user.controller");
route.get("/user/profile/:id", authMiddleware, getUserProfileController);
route.put(
  "/user/profile/update",
  authMiddleware,
  upload.single("profile_image"),
  updateUserProfileController,
);
route.get("/users", authMiddleware, getAllUsersController);
module.exports = route;
