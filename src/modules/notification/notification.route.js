const express = require("express");
const route = express.Router();

const {
  getNotificationsController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
} = require("./notification.controller");
const authMiddleware = require("../../middleware/auth.middleware");

route.get("/notifications", authMiddleware, getNotificationsController);
route.put("/notifications/read-all", authMiddleware, markAllAsReadController);
route.put(
  "/notifications/:notificationId/read",
  authMiddleware,
  markAsReadController,
);
route.delete(
  "/notifications/:notificationId",
  authMiddleware,
  deleteNotificationController,
);
module.exports = route;
