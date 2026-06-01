// ✅ بنستخدمه في أي مكان عشان نبعت Notification
const sendNotification = (receiverId, notification) => {
  const socketId = global.connectedUsers.get(receiverId.toString());

  if (socketId) {
    global.io.to(socketId).emit("notification", notification);
    console.log(`Notification sent to user ${receiverId}`);
  }
};

module.exports = { sendNotification };
