const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { generateRefreshToken, generateAccessToken } = require("./auth.tokens");

const registerService = async ({ userName, email, password }) => {
  // check if email exist
  const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (userExists.rows.length > 0) {
    throw new Error("Email already exists");
  }

  // hash to password
  const hashedPassword = await bcrypt.hash(password, 10);

  //  insert user
  const newUser = await pool.query(
    `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) 
     RETURNING id, username, email, created_at `,
    [username, email, hashedPassword],
  );
  return newUser.rows[0];
};

// login
const loginService = async ({ email, password }) => {
  // check email
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (user.rows.length === 0) {
    throw new Error("invalid email");
  }

  // check password
  const invalidPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!invalidPassword) {
    throw new Error("invalid password");
  }

  const accessToken = await generateAccessToken(user.rows[0].id);
  const refreshToken = await generateRefreshToken(user.rows[0].id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
    },
  };
};

module.exports = { registerService, loginService };
