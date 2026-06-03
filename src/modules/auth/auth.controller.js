const { registerService, loginService } = require("./auth.services");
const {
  verifyRefreshToken,
  generateAccessToken,
  deleteRefreshToken,
} = require("./auth.tokens");
const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await registerService({ username, email, password });
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// login
const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { accessToken, refreshToken, user } = await loginService({
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", accessToken, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// refresh token
const refreshTokenController = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // check if token in db
    const stored = await verifyRefreshToken(token);

    if (!stored) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    // ✅ generate new access token
    const accessToken = generateAccessToken(stored.user_id);

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

// logout controller
const logoutController = async (req, res) => {
  const token = req.cookies.refreshToken;

  try {
    if (token) {
      await deleteRefreshToken(token); // delete token from db
    }

    res.clearCookie("refreshToken"); // ✅ امسح الـ Cookie
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
};
