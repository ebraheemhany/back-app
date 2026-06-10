// friend.route.js
const express = require("express");
const route = express.Router();
const { getFriendsController } = require("./friends.controller");
const authMiddleware = require("../../middleware/auth.middleware");

route.get("/friends", authMiddleware, getFriendsController);

module.exports = route;
