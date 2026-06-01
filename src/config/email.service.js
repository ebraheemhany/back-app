const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password OTP",
    html: `
      <h2>Reset Password</h2>
      <p>الـ OTP بتاعك هو:</p>
      <h1 style="color: #4CAF50; letter-spacing: 5px">${otp}</h1>
      <p>صالح لمدة 10 دقايق بس</p>
    `,
  });
};

module.exports = { sendOTPEmail };
