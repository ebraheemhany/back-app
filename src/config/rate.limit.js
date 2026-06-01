const rateLimit = require("express-rate-limit");

// protection all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 menuts
  max: 100, // maxmim of requests
  message: { message: "Too many requests, please try again later" },
});

// protection auth route
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 menuts
  max: 10, // maxmim of requests
  message: { message: "Too many login attempts, please try again later" },
});

// protection send otp
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3, // 3 محاولات بس
  message: { message: "Too many OTP requests, please try again after an hour" },
});

module.exports = { globalLimiter, authLimiter, otpLimiter };
