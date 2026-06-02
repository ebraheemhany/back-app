const Brevo = require("@getbrevo/brevo");

const client = Brevo.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

const sendOTPEmail = async (email, otp) => {
  const sendSmtpEmail = {
    to: [{ email }],
    sender: { email: "alihasan666.co@gmail.com", name: "App" },
    subject: "Reset Password OTP",
    htmlContent: `
      <h2>Reset Password</h2>
      <p>الـ OTP بتاعك هو:</p>
      <h1 style="color: #4CAF50; letter-spacing: 5px">${otp}</h1>
      <p>صالح لمدة 10 دقايق بس</p>
    `,
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = { sendOTPEmail };