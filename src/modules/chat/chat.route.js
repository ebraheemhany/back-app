const express = require("express");
const route = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const {
  getOrCreateConversationController,
  sendMessageController,
  getConversationsController,
  getMessagesController,
  deleteMessageController,
} = require("./chat.controller");

route.post(
  "/conversations/:userId",
  authMiddleware,
  getOrCreateConversationController,
);
route.post(
  "/conversations/:conversationId/messages",
  authMiddleware,
  sendMessageController,
);
route.get("/conversations", authMiddleware, getConversationsController);
route.get(
  "/conversations/:conversationId/messages",
  authMiddleware,
  getMessagesController,
);
route.delete("/messages/:messageId", authMiddleware, deleteMessageController);
module.exports = route;
