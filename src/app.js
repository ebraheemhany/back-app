const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const cors = require("cors");
const authRoute = require("./modules/auth/auth.route");
const forgetPasswordRoute = require("./modules/forgetPass/forget.password.routes");
const userProfileRoute = require("../src/modules/users/uesr.route");
const postRoute = require("./modules/posts/post.route");
const likeRoute = require("./modules/likes/like.route");
const commentRoute = require("./modules/comments/comment.route");
const notificationRoute = require("./modules/notification/notification.route");
const followRoute = require("./modules/follow/follow.route");
const chatRoute = require("./modules/chat/chat.route");
const storeRoute = require("./modules/Stories/story.route");
const app = express();
const passport = require("passport");
require("./modules/auth/google.strategy");
app.use(helmet());
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "https://social-app-8jsk.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // السماح لـ Postman والأدوات بدون origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.get("/api", (req, res) => {
  res.send("API Running...");
});

app.use("/api", authRoute);
app.use("/api", forgetPasswordRoute);
app.use("/api", userProfileRoute);
app.use("/api", postRoute);
app.use("/api", likeRoute);
app.use("/api", commentRoute);
app.use("/api", notificationRoute);
app.use("/api", followRoute);
app.use("/api", chatRoute);
app.use("/api", storeRoute);
module.exports = app;
