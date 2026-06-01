const pool = require("../../config/db");
const { sendNotification } = require("../../config/socket.service");
const createNotificationService = async ({
  senderId,
  receiverId,
  type,
  postId = null,
  message,
}) => {
  // don't send notification to yourselve
  if (senderId === receiverId) return;

  // create notification
  const notification = await pool.query(
    `INSERT INTO notifications (sender_id, receiver_id, type, post_id, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [senderId, receiverId, type, postId, message],
  );
  // get sendr data
  const sender = await pool.query(
    `SELECT id, username, profile_image FROM users WHERE id = $1`,
    [senderId],
  );

  sendNotification(receiverId, {
    ...notification.rows[0],
    sender: sender.rows[0],
  });

  return notification.rows[0];
};

// get user notification
const getNotificationsService = async (userId) => {
  const notifications = await pool.query(
    `SELECT 
      notifications.id,
      notifications.type,
      notifications.message,
      notifications.is_read,
      notifications.created_at,
      notifications.post_id,
      users.id AS sender_id,
      users.username AS sender_name,
      users.profile_image AS sender_image
     FROM notifications
     JOIN users ON notifications.sender_id = users.id
     WHERE notifications.receiver_id = $1
     ORDER BY notifications.created_at DESC
     `,
    [userId],
  );

  // count => unread message
  const unread = await pool.query(
    `SELECT COUNT(*) FROM notifications 
     WHERE receiver_id = $1 AND is_read = FALSE`,
    [userId],
  );

  // notification total
  const total = await pool.query(
    `SELECT COUNT(*) FROM notifications WHERE receiver_id = $1`,
    [userId],
  );

  return {
    notifications: notifications.rows,
    unread: parseInt(unread.rows[0].count),
    total: parseInt(total.rows[0].count),
  };
};

// Mark as Read Notification
const markAsReadService = async (userId, notificationId) => {
  await pool.query(
    `UPDATE notifications 
     SET is_read = TRUE 
     WHERE id = $1 AND receiver_id = $2`,
    [notificationId, userId],
  );
  return { message: "Notification marked as read" };
};

// Mark All as Read Notification
const markAllAsReadService = async (userId) => {
  await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE receiver_id = $1`,
    [userId],
  );
  return { message: "All notifications marked as read" };
};

// Delete Notification
const deleteNotificationService = async (userId, notificationId) => {
  await pool.query(
    `DELETE FROM notifications WHERE id = $1 AND receiver_id = $2`,
    [notificationId, userId],
  );
  return { message: "Notification deleted" };
};

module.exports = {
  createNotificationService,
  getNotificationsService,
  markAsReadService,
  markAllAsReadService,
  deleteNotificationService,
};
