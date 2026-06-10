const pool = require("../../config/db");

const toggleSavePostService = async (userId, postId) => {
  const existing = await pool.query(
    `SELECT * FROM saved_posts WHERE user_id = $1 AND post_id = $2`,
    [userId, postId],
  );

  if (existing.rows.length > 0) {
    await pool.query(
      `DELETE FROM saved_posts WHERE user_id = $1 AND post_id = $2`,
      [userId, postId],
    );
    return { saved: false };
  }

  await pool.query(
    `INSERT INTO saved_posts (user_id, post_id) VALUES ($1, $2)`,
    [userId, postId],
  );
  return { saved: true };
};

const getSavedPostsService = async (userId) => {
  const result = await pool.query(
    `SELECT 
      posts.id,
      posts.content,
      posts.media_url,
      posts.media_type,
      posts.created_at,
      users.username,
      users.profile_image
     FROM saved_posts
     JOIN posts ON saved_posts.post_id = posts.id
     JOIN users ON posts.user_id = users.id
     WHERE saved_posts.user_id = $1
     ORDER BY saved_posts.created_at DESC`,
    [userId],
  );
  return result.rows;
};

module.exports = { toggleSavePostService, getSavedPostsService };
