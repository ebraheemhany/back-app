const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const getUserProfileService = async (userId) => {
  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);

  if (user.rows.length === 0) {
    throw new Error("User not found");
  }
  return user.rows[0];
};

const updateUserProfileService = async (
  userId,
  { username, email, password, profile_image, bio },
) => {
  // check if user exist
  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);

  if (user.rows.length === 0) {
    throw new Error("User not found");
  }

  // check if new email is exist
  if (email) {
    const emailExists = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND id != $2`,
      [email, userId],
    );
    if (emailExists.rows.length > 0) {
      throw new Error("Email already exists");
    }
  }
  const hashPassword = password ? await bcrypt.hash(password, 10) : null;

  //   update user profile
  const update = await pool.query(
    `UPDATE users SET username = COALESCE($1, username),
         email = COALESCE($2, email), 
        password = COALESCE ($3 , password),
        profile_image = COALESCE($4 , profile_image),
         bio = COALESCE($5 , bio)
          WHERE id = $6
     RETURNING id, username, email, created_at, password,profile_image, bio
         
         `,
    [username, email, hashPassword, profile_image, bio, userId],
  );

  return update.rows[0];
};



module.exports = {
  getUserProfileService,
  updateUserProfileService,

};
