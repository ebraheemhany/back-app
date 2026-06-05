const pool = require("../../config/db");

const createPostService = async (
  userId,
  { content, media_url, media_type, public_id },
) => {
  const post = await pool.query(
    `
    INSERT INTO posts (user_id, content, media_url, media_type ,public_id)
    VALUES ($1, $2, $3, $4 , $5)
    RETURNING *
    `,
    [userId, content, media_url, media_type, public_id],
  );

  return post.rows[0];
};

const deletePostService = async (postId, userId) => {
  const post = await pool.query(`SELECT * FROM posts WHERE id = $1`, [postId]);

  // check post exists
  if (post.rows.length === 0) {
    throw new Error("Post not found");
  }

  // check owner
  if (post.rows[0].user_id !== userId) {
    throw new Error("Unauthorized - this post is not yours");
  }

  return post.rows[0];
};

// في getAllPostsService — بعد ما تعرف userId من الـ JWT
const getAllPostsService = async (userId) => {
  const posts = await pool.query(
    `SELECT 
      posts.id,
      posts.content,
      posts.media_url,
      posts.media_type,
      posts.created_at,
      users.id AS user_id,
      users.username,
      users.profile_image,
      COUNT(DISTINCT likes.id) AS likes_count,
      COUNT(DISTINCT comments.id) AS comments_count,
      -- ✅ هل الـ current user عمل like؟
      BOOL_OR(likes.user_id = $1) AS is_liked
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON likes.post_id = posts.id
    LEFT JOIN comments ON comments.post_id = posts.id
    GROUP BY posts.id, users.id
    ORDER BY posts.created_at DESC`,
    [userId],
  );
  return posts.rows;
};

const updatePostService = async (postId, userId) => {
  const post = await pool.query(`SELECT * FROM posts WHERE id = $1`, [postId]);
  if (!post) {
    throw new Error("post not found");
  }
  if (post.rows[0].user_id !== userId) {
    throw new Error("Unauthorized - this post is not yours");
  }
  return post.rows[0];
};

const searchService = async (query) => {
  // 1- search posts
  const postsResult = await pool.query(
    `
    SELECT 
      posts.id,
      posts.content,
      posts.media_url,
      posts.media_type,
      posts.created_at,

      users.id AS user_id,
      users.username,
      users.profile_image

    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.content ILIKE $1
    ORDER BY posts.created_at DESC
    `,
    [`%${query}%`],
  );

  // 2- search users
  const usersResult = await pool.query(
    `
    SELECT 
      id,
      username,
      profile_image,
      created_at
    FROM users
    WHERE username ILIKE $1
    `,
    [`%${query}%`],
  );

  return {
    posts: postsResult.rows,
    users: usersResult.rows,
  };
};
const getPostsByUserIdService = async (userId) => {
  const posts = await pool.query(
    `SELECT 
      posts.id,
      posts.content,
      posts.media_url,
      posts.media_type,
      posts.created_at,
      users.id AS user_id,
      users.username,
      users.profile_image,
      COUNT(DISTINCT likes.id) AS likes_count,
      COUNT(DISTINCT comments.id) AS comments_count
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN comments ON posts.id = comments.post_id
    WHERE posts.user_id = $1
    GROUP BY posts.id, users.id
    ORDER BY posts.created_at DESC`,
    [userId],
  );

  return posts.rows;
};

const getTrendingPostsService = async (userId) => {
  const posts = await pool.query(
    `SELECT 
      posts.id,
      posts.content,
      posts.media_url,
      posts.media_type,
      posts.created_at,
      users.id AS user_id,
      users.username,
      users.profile_image,
      COUNT(DISTINCT likes.id) AS likes_count,
      COUNT(DISTINCT comments.id) AS comments_count,
      BOOL_OR(likes.user_id = $1) AS is_liked,
      -- ✅ score بيحسب الـ trending
      (COUNT(DISTINCT likes.id) * 2 + COUNT(DISTINCT comments.id)) AS score
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON likes.post_id = posts.id
    LEFT JOIN comments ON comments.post_id = posts.id
    GROUP BY posts.id, users.id
    ORDER BY score DESC
    `,
    [userId],
  );
  return posts.rows;
};
const getPostByIdService = async (postId, userId) => {
  const result = await pool.query(
    `SELECT 
      posts.id,
      posts.content,
      posts.media_url,
      posts.media_type,
      posts.created_at,
      users.id AS user_id,
      users.username,
      users.profile_image,
      COUNT(DISTINCT likes.id) AS likes_count,
      COUNT(DISTINCT comments.id) AS comments_count,
      BOOL_OR(likes.user_id = $2) AS is_liked
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON likes.post_id = posts.id
    LEFT JOIN comments ON comments.post_id = posts.id
    WHERE posts.id = $1
    GROUP BY posts.id, users.id`,
    [postId, userId],
  );

  if (result.rows.length === 0) throw new Error("Post not found");
  return result.rows[0];
};

module.exports = {
  createPostService,
  deletePostService,
  getAllPostsService,
  updatePostService,
  searchService,
  getPostsByUserIdService,
  getTrendingPostsService,
  getPostByIdService,
};
