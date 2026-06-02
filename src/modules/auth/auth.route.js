const express = require("express");
const validateMiddleware = require("../../middleware/validate.middleware");
const {
  registerValidation,
  loginValidation,
} = require("../../config/validation");
const route = express.Router();
const passport = require("passport");
const {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
} = require("./auth.controller");
const { authLimiter } = require("../../config/rate.limit");
const { googleController } = require("./auth.google.controller");

route.post(
  "/register",
  validateMiddleware(registerValidation),
  registerController,
);
route.post(
  "/login",
  authLimiter,
  validateMiddleware(loginValidation),
  loginController,
);
route.post("/refresh", refreshTokenController);
route.post("/logout", logoutController);

// google login
route.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    // Passport will redirect to Google
  },
);

route.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/login",
  }),
  googleController,
);

module.exports = route;
