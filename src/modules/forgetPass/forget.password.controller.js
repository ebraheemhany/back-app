const {
  sendOTPService,
  verifyOTPService,
  resetPasswordService,
} = require("./forget.password.service");

// send otp
const sendOTPController = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await sendOTPService({ email });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// check otp
const verifyOTPController = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const result = await verifyOTPService({ email, otp });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// change password
const resetPasswordController = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const result = await resetPasswordService({ email, newPassword });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  sendOTPController,
  verifyOTPController,
  resetPasswordController,
};
