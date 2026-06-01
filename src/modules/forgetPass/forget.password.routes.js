const express = require("express");
const route = express.Router();
const { otpLimiter } = require("../../config/rate.limit");
const {
  sendOTPController,
  verifyOTPController,
  resetPasswordController,
} = require("./forget.password.controller");

route.post("/forget-password", otpLimiter, sendOTPController);
route.post("/verify-otp", verifyOTPController);
route.post("/reset-password", resetPasswordController);

module.exports = route;
