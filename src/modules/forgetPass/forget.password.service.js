const pool = require("../../config/db");
const { sendOTPEmail } = require("../../config/email.service");
const bcrypt = require("bcrypt");

// send otp
const sendOTPService = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const cleanEmail = email.trim().toLowerCase();
  // check if user not found
  const user = await pool.query(`SELECT * FROM users WHERE email = $1 `, [
    cleanEmail,
  ]);

  if (user.rows.length === 0) {
    throw Error("user not found");
  }

  // delete old otp
  await pool.query(`DELETE FROM password_reset_otp WHERE user_id = $1`, [
    user.rows[0].id,
  ]);

  // send new otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // save otp in db
  await pool.query(
    `INSERT INTO password_reset_otp (user_id, otp, expires_at) 
     VALUES ($1, $2, $3)`,
    [user.rows[0].id, otp, expiresAt],
  );

  await sendOTPEmail(email, otp);

  return { message: "OTP sent to your email" };
};

// verifyO TP
const verifyOTPService = async ({ email, otp }) => {
  // check if user not found
  const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (user.rows.length === 0) {
    throw new Error("Email not found");
  }

  // check otp
  const result = await pool.query(
    `SELECT * FROM password_reset_otp WHERE user_id = $1 AND otp = $2 AND expires_at > NOW()`,
    [user.rows[0].id, otp],
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid or expired OTP");
  }
  //   change is_verified to true
  await pool.query(
    `UPDATE password_reset_otp SET is_verified = TRUE 
     WHERE user_id = $1`,
    [user.rows[0].id],
  );
  return { message: "OTP verified successfully" };
};

// change password
const resetPasswordService = async ({ email, newPassword }) => {
  // check if user not found
  const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (user.rows.length === 0) {
    throw new Error("Email not found");
  }
  //   check if otp is verified
  const result = await pool.query(
    `SELECT * FROM password_reset_otp 
     WHERE user_id = $1 AND is_verified = TRUE`,
    [user.rows[0].id],
  );

  if (result.rows.length === 0) {
    throw new Error("Please verify OTP first");
  }
  // hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  //   update password
  await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [
    hashedPassword,
    user.rows[0].id,
  ]);

  // delete otp
  await pool.query(`DELETE FROM password_reset_otp WHERE user_id = $1`, [
    user.rows[0].id,
  ]);

  return { message: "Password reset successfully" };
};

module.exports = { sendOTPService, verifyOTPService, resetPasswordService };
