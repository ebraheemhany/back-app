const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../../config/db");

// 1 => generate ccess token
const generateAccessToken = async (userId) => {
  return jwt.sign(
    { userId },

    process.env.JWT_SECRET,

    { expiresIn: "15m" },
  );
};

// 2 => generate refresh token
const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(64).toString("hex");
  const expiesAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // expires is 7 days

  await pool.query(
    `INSERT INTO refresh_tokens (user_Id , token , expires_at ) VALUES ($1 , $2 , $3)`,
    [userId, token, expiesAt],
  );

  return token;
};

// 3 => verifyRefreshToken
const verifyRefreshToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()`,
    [token],
  );

  if (result.rows.length === 0) return null;
  return result.rows[0];
};

//  4 => delete refresh token ===> logout
const deleteRefreshToken = async (token) => {
  await pool.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
};
