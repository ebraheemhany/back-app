const { generateRefreshToken, generateAccessToken } = require("./auth.tokens");

const googleController = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      `http://localhost:3000/sign-in?token=${accessToken}`
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { googleController };
