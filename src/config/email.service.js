// const SibApiV3Sdk = require("@getbrevo/brevo");

// const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
// apiInstance.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

// const sendOTPEmail = async (email, otp) => {
//   const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//   sendSmtpEmail.to = [{ email }];
//   sendSmtpEmail.sender = { email: "alihasan666.co@gmail.com", name: "App" };
//   sendSmtpEmail.subject = "Reset Password OTP";
//   sendSmtpEmail.htmlContent = `
//     <h2>Reset Password</h2>
//     <p>الـ OTP بتاعك هو:</p>
//     <h1 style="color: #4CAF50; letter-spacing: 5px">${otp}</h1>
//     <p>صالح لمدة 10 دقايق بس</p>
//   `;

//   await apiInstance.sendTransacEmail(sendSmtpEmail);
// };

// module.exports = { sendOTPEmail };

const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendOTPEmail = async (email, otp) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = {
    email: process.env.SENDER_EMAIL,
    name: "App",
  };

  sendSmtpEmail.to = [{ email }];

  sendSmtpEmail.subject = "Reset Password OTP";

  sendSmtpEmail.htmlContent = `
    <h2>Reset Password</h2>
    <p>OTP Code:</p>
    <h1>${otp}</h1>
  `;

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = { sendOTPEmail };
