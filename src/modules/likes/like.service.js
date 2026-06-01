const pool = require("../../config/db");
const {
  createNotificationService,
} = require("../notification/notification.service");
const createLikeService = async (userId, postId) => {
  // check if post already exist
  const post = await pool.query(`SELECT * FROM posts WHERE id = $1`, [postId]);
  if (post.rows.length === 0) {
    throw new Error("post not found");
  }

  // check if like exist
  const existingLike = await pool.query(
    `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId],
  );

  // check if like exist remove him || add like if not exist
  if (existingLike.rows.length > 0) {
    // delete like
    await pool.query(`DELETE FROM likes WHERE user_id = $1 and post_id = $2`, [
      userId,
      postId,
    ]);

    //   calculate count
    const count = await getLikesCountService(postId);
    return { message: "post unliked", liked: false, count };
  } else {
    // add like
    await pool.query(`INSERT INTO likes (user_id , post_id) VALUES ($1,$2)`, [
      userId,
      postId,
    ]);

    await createNotificationService({
      senderId: userId,
      receiverId: post.rows[0].user_id,
      type: "like",
      postId,
      message: "liked your post",
    });

    const count = await getLikesCountService(postId);
    return { message: "post liked", liked: true, count };
  }
};

// get likes count
const getLikesCountService = async (postId) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM likes WHERE post_id = $1`,
    [postId],
  );
  return parseInt(result.rows[0].count);
};

// get post likes and user add like
const postLikesService = async (postId) => {
  const post = await pool.query(`SELECT * FROM posts WHERE  id = $1`, [postId]);
  if (post.rows.length === 0) {
    throw new Error("post not found");
  }

  const likes = await pool.query(
    `SELECT users.id , users.username , users.profile_image FROM
     likes JOIN users ON likes.user_id = users.id  
     WHERE likes.post_id = $1
     ORDER BY likes.created_at DESC
     `,
    [postId],
  );

  return {
    count: likes.rows.length,
    users: likes.rows,
  };
};

module.exports = { createLikeService, getLikesCountService, postLikesService };
