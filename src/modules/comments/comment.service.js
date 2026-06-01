const pool = require("../../config/db");
const {
  createNotificationService,
} = require("../notification/notification.service");
const createCommentService = async (userId, postId, content) => {
  // check if post exist
  const post = await pool.query(`SELECT * FROM posts WHERE id = $1`, [postId]);
  if (post.rows.length === 0) {
    throw new Error("Post Not Found");
  }

  // add comment
  const comment = await pool.query(
    `INSERT INTO comments (user_id , post_id , content)
     VALUES ($1 , $2, $3) RETURNING *`,
    [userId, postId, content],
  );

  // retun user data and comment to show it
  const result = await pool.query(
    `SELECT 
      comments.id,
      comments.content,
      comments.created_at,
      users.id AS user_id,
      users.username,
      users.profile_image
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.id = $1
    `,
    [comment.rows[0].id],
  );

  await createNotificationService({
    senderId: userId,
    receiverId: post.rows[0].user_id,
    type: "comment",
    postId,
    message: "commented on your post",
  });

  return result.rows[0];
};

const getAllCommentsService = async (postId) => {
  // check if post exist
  const post = await pool.query(`SELECT * FROM posts WHERE id = $1`, [postId]);

  if (post.rows.length === 0) {
    throw new Error("Post Not Found");
  }

  // get comments
  const comments = await pool.query(
    `SELECT 
      comments.id,
      comments.content,
      comments.created_at,
      users.id AS user_id,
      users.username,
      users.profile_image
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at DESC
    `,
    [postId],
  );
  // GET TOTAL COMMENTS
  const total = await pool.query(
    `SELECT COUNT(*) FROM comments WHERE post_id = $1`,
    [postId],
  );
  return {
    comments: comments.rows,
    total: parseInt(total.rows[0].count),
  };
};

const editCommentService = async (commentId, userId, content) => {
  // check comment
  const comment = await pool.query(`SELECT * FROM comments WHERE id = $1`, [
    commentId,
  ]);
  if (comment.rows.length === 0) {
    throw new Error("Comment Not Found");
  }

  // check if this user he is right comment
  if (parseInt(comment.rows[0].user_id) !== parseInt(userId)) {
    throw new Error("Unauthorized");
  }

  // update comment
  const updateComment = await pool.query(
    `UPDATE comments SET content = $1 , updated_at = NOW() WHERE id = $2 RETURNING *
    
    `,
    [content, commentId],
  );
  return updateComment.rows[0];
};

const deleteCommentService = async (userId, commentId) => {
  // check comment
  const comment = await pool.query(`SELECT * FROM comments WHERE id = $1`, [
    commentId,
  ]);
  if (comment.rows.length === 0) {
    throw new Error("Comment Not Found");
  }
  // check if this user he is right comment
  if (parseInt(comment.rows[0].user_id) !== parseInt(userId)) {
    throw new Error("Unauthorized");
  }

  await pool.query(`DELETE FROM comments WHERE id = $1`, [commentId]);
  return { message: "Comment deleted Successfuly" };
};

module.exports = {
  createCommentService,
  getAllCommentsService,
  editCommentService,
  deleteCommentService,
};
