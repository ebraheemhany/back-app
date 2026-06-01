const {
  getOrCreateConversationService,
  sendMessageService,
  getConversationsService,
  getMessagesService,
  deleteMessageService,
} = require("./chat.service");

const getOrCreateConversationController = async (req, res) => {
  try {
    const conversation = await getOrCreateConversationService(
      req.user.userId,
      parseInt(req.params.userId),
    );
    res.status(200).json({ conversation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendMessageController = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }

    // ✅ sendMessageService بترجع الرسالة + الـ receiverId
    const { message, receiverId } = await sendMessageService(
      req.user.userId,
      parseInt(req.params.conversationId),
      content,
    );

    // ✅ ابعت Real-time من الـ Controller
    const socketId = global.connectedUsers.get(receiverId.toString());
    if (socketId) {
      global.io.to(socketId).emit("new_message", message);
    }

    res.status(201).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getConversationsController = async (req, res) => {
  try {
    const conversations = await getConversationsService(req.user.userId);
    res.status(200).json({ conversations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMessagesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await getMessagesService(
      req.user.userId,
      parseInt(req.params.conversationId),
      page,
      limit,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMessageController = async (req, res) => {
  try {
    const result = await deleteMessageService(
      parseInt(req.params.messageId),
      req.user.userId,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getOrCreateConversationController,
  sendMessageController,
  getConversationsController,
  getMessagesController,
  deleteMessageController,
};
