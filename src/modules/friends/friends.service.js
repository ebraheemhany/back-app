const pool = require("../../config/db")
      users.id,
      users.username,
      users.profile_image,
      users.bio
     FROM follows f1
     JOIN follows f2 
       ON f1.following_id = f2.follower_id 
       AND f1.follower_id = f2.following_id
     JOIN users ON users.id = f1.following_id
     WHERE f1.follower_id = $1`,
    [userId]
  );

  return result.rows;
};

module.exports = { getFriendsService };