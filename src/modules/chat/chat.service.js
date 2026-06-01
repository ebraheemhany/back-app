const pool = require("../../config/db");

const getOrCreateConversationService = async (user1Id, user2Id) => {
  // check if user2 exist
  const user2 = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    user2Id,
  ]);

  if (user2.rows.length === 0) {
    throw new Error("User not found");
  }

  // check if any conversation exist befor
  let conversation = await pool.query(
    `SELECT * FROM conversations 
     WHERE (user1_id = $1 AND user2_id = $2)
     OR (user1_id = $2 AND user2_id = $1)`,
    [user1Id, user2Id],
  );
  // if not exist add new conversation
  if (conversation.rows.length === 0) {
    conversation = await pool.query(
      `INSERT INTO conversations (user1_id, user2_id)
       VALUES ($1, $2)
       RETURNING *`,
      [user1Id, user2Id],
    );
  }

  return conversation.rows[0];
};

// Send Message
const sendMessageService = async (senderId, conversationId, content) => {
  const conversation = await pool.query(
    `SELECT * FROM conversations WHERE id = $1
     AND (user1_id = $2 OR user2_id = $2)`,
    [conversationId, senderId],
  );

  if (conversation.rows.length === 0) {
    throw new Error("Conversation not found");
  }

  const message = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [conversationId, senderId, content],
  );

  await pool.query(
    `UPDATE conversations 
     SET last_message = $1, last_message_at = NOW()
     WHERE id = $2`,
    [content, conversationId],
  );

  // ✅ parseInt عشان نتأكد من النوع
  const receiverId =
    parseInt(conversation.rows[0].user1_id) === parseInt(senderId)
      ? conversation.rows[0].user2_id
      : conversation.rows[0].user1_id;

  return { message: message.rows[0], receiverId };
};
//Get All Conversations
const getConversationsService = async (userId) => {
  const conversations = await pool.query(
    `SELECT 
      conversations.id,
      conversations.last_message,
      conversations.last_message_at,
      -- ✅ جيب بيانات الشخص التاني
      CASE 
        WHEN conversations.user1_id = $1 THEN u2.id
        ELSE u1.id
      END AS other_user_id,
      CASE 
        WHEN conversations.user1_id = $1 THEN u2.username
        ELSE u1.username
      END AS other_username,
      CASE 
        WHEN conversations.user1_id = $1 THEN u2.profile_image
        ELSE u1.profile_image
      END AS other_profile_image,
      -- ✅ عدد الرسايل الغير مقروءة
      COUNT(CASE WHEN messages.is_read = FALSE 
            AND messages.sender_id != $1 
            THEN 1 END) AS unread_count
     FROM conversations
     JOIN users u1 ON conversations.user1_id = u1.id
     JOIN users u2 ON conversations.user2_id = u2.id
     LEFT JOIN messages ON conversations.id = messages.conversation_id
     WHERE conversations.user1_id = $1 OR conversations.user2_id = $1
     GROUP BY conversations.id, u1.id, u2.id
     ORDER BY conversations.last_message_at DESC`,
    [userId],
  );

  return conversations.rows;
};

// Get Messages
const getMessagesService = async (userId, conversationId) => {
  // تأكد إنك جزء من الـ Conversation
  const conversation = await pool.query(
    `SELECT * FROM conversations WHERE id = $1
     AND (user1_id = $2 OR user2_id = $2)`,
    [conversationId, userId],
  );

  if (conversation.rows.length === 0) {
    throw new Error("Conversation not found");
  }

  // ✅ جيب الرسايل
  const messages = await pool.query(
    `SELECT 
      messages.id,
      messages.content,
      messages.is_read,
      messages.created_at,
      users.id AS sender_id,
      users.username AS sender_name,
      users.profile_image AS sender_image
     FROM messages
     JOIN users ON messages.sender_id = users.id
     WHERE messages.conversation_id = $1
     ORDER BY messages.created_at DESC
     `,
    [conversationId],
  );

  // ✅ علّم الرسايل كمقروءة
  await pool.query(
    `UPDATE messages SET is_read = TRUE
     WHERE conversation_id = $1 AND sender_id != $2`,
    [conversationId, userId],
  );

  return {
    messages: messages.rows.reverse(), // ✅ الأقدم الأول
  };
};
//Delete Message
const deleteMessageService = async (messageId, userId) => {
  const message = await pool.query(`SELECT * FROM messages WHERE id = $1`, [
    messageId,
  ]);

  if (message.rows.length === 0) {
    throw new Error("Message not found");
  }

  if (message.rows[0].sender_id !== userId) {
    throw new Error("Unauthorized");
  }

  await pool.query(`DELETE FROM messages WHERE id = $1`, [messageId]);
  return { message: "Message deleted successfully" };
};

module.exports = {
  getOrCreateConversationService,
  sendMessageService,
  getConversationsService,
  getMessagesService,
  deleteMessageService,
};
