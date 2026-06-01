const { generateRefreshToken, generateAccessToken } = require("./auth.tokens");

const googleController = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    // save refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "login successfuly",
      accessToken,
      user: {
        id: user.id,
        userName: user.username,
        email: user.email,
      },
    });

    //     res.redirect(
    //   `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}`
    // );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { googleController };
