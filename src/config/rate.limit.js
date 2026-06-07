const rateLimit = require("express-rate-limit");

const skipOptions = (req) => req.method === "OPTIONS"; // ✅ استثني الـ preflight

// protection all routes

// protection auth route
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip: skipOptions, // ✅
  message: { message: "Too many login attempts, please try again later" },
});

// protection send otp
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  skip: skipOptions, // ✅
  message: { message: "Too many OTP requests, please try again after an hour" },
});

module.exports = { authLimiter, otpLimiter };
