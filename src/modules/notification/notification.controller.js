const {
  getNotificationsService,
  markAsReadService,
  markAllAsReadService,
  deleteNotificationService,
} = require("./notification.service");

const getNotificationsController = async (req, res) => {
  try {
    const resulte = await getNotificationsService(req.user.userId);
    res.status(200).json({ success: true, ...resulte });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Mark as Read
const markAsReadController = async (req, res) => {
  try {
    const result = await markAsReadService(
      req.user.userId,
      req.params.notificationId,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Mark All as Read
const markAllAsReadController = async (req, res) => {
  try {
    const result = await markAllAsReadService(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Notification
const deleteNotificationController = async (req, res) => {
  try {
    const result = await deleteNotificationService(
      req.user.userId,
      req.params.notificationId,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getNotificationsController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
};
