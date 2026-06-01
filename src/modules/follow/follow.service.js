const pool = require("../../config/db");
const {
  createNotificationService,
} = require("../notification/notification.service");

// create follow
const createFollowService = async (followerId, followingId) => {
  // do not flowing your selive
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  // check if usre exist
  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    followingId,
  ]);
  if (user.rows.length === 0) {
    throw new Error("User not found");
  }

  // check if existing follow aleardy exist
  const existingFollow = await pool.query(
    `SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2`,
    [followerId, followingId],
  );

  if (existingFollow.rows.length > 0) {
    // ✅ Unfollow
    await pool.query(
      `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
      [followerId, followingId],
    );
    return { message: "Unfollowed successfully", following: false };
  } else {
    // ✅ Follow
    await pool.query(
      `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)`,
      [followerId, followingId],
    );
    //   send a notification
    await createNotificationService({
      senderId: followerId,
      receiverId: followingId,
      type: "follow",
      message: "started following you",
    });
    return { message: "Followed successfully", following: true };
  }
};

// Get Followers (مين بيتبعني)
const getFollowersService = async (userId) => {
  // get followers
  const followers = await pool.query(
    `SELECT 
      users.id,
      users.username,
      users.profile_image,
      users.bio,
      follows.created_at
     FROM follows
     JOIN users ON follows.follower_id = users.id
     WHERE follows.following_id = $1
     ORDER BY follows.created_at DESC`,
    [userId],
  );
  // total followers
  const total = await pool.query(
    `SELECT COUNT(*) FROM follows WHERE following_id = $1`,
    [userId],
  );
  return {
    followers: followers.rows,
    total: parseInt(total.rows[0].count),
  };
};

// Get Following (مين بتابعه)
const getFollowingService = async (userId) => {
  const following = await pool.query(
    `SELECT 
      users.id,
      users.username,
      users.profile_image,
      users.bio,
      follows.created_at
     FROM follows
     JOIN users ON follows.following_id = users.id
     WHERE follows.follower_id = $1
     ORDER BY follows.created_at DESC
     `,
    [userId],
  );

  const total = await pool.query(
    `SELECT COUNT(*) FROM follows WHERE follower_id = $1`,
    [userId],
  );

  return {
    following: following.rows,
    total: parseInt(total.rows[0].count),
  };
};

// Get Follow Stats
const getFollowStatsService = async (userId) => {
  const followers = await pool.query(
    `SELECT COUNT(*) FROM follows WHERE following_id = $1`,
    [userId],
  );

  const following = await pool.query(
    `SELECT COUNT(*) FROM follows WHERE follower_id = $1`,
    [userId],
  );

  return {
    followers: parseInt(followers.rows[0].count),
    following: parseInt(following.rows[0].count),
  };
};
// Check if Following
const isFollowingService = async (followerId, followingId) => {
  const result = await pool.query(
    `SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2`,
    [followerId, followingId],
  );
  return { isFollowing: result.rows.length > 0 };
};
module.exports = {
  createFollowService,
  getFollowersService,
  getFollowingService,
  getFollowStatsService,
  isFollowingService,
};
