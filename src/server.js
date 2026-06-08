const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const {
  deleteExpiredStoriesService,
} = require("./modules/Stories/story.service");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://social-app-8jsk-96rn9ciw5-ebraheemhanys-projects.vercel.app",
    ],
    credentials: true,
  },
});

global.io = io;

const connectedUsers = new Map();
global.connectedUsers = connectedUsers;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ تسجيل اليوزر
  socket.on("register", (userId) => {
    connectedUsers.set(userId.toString(), socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // ✅ اليوزر بيدخل محادثة
  socket.on("join_conversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`User joined conversation ${conversationId}`);
  });

  // ✅ اليوزر بيكتب
  socket.on("typing", ({ conversationId, userId }) => {
    socket.to(`conversation_${conversationId}`).emit("typing", { userId });
  });

  // ✅ اليوزر وقف يكتب
  socket.on("stop_typing", ({ conversationId, userId }) => {
    socket.to(`conversation_${conversationId}`).emit("stop_typing", { userId });
  });

  // ✅ قفل التطبيق
  socket.on("disconnect", () => {
    connectedUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
});

// ✅ شغّل كل ساعة
setInterval(
  async () => {
    await deleteExpiredStoriesService();
  },
  60 * 60 * 1000,
);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
