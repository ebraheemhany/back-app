const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, otp) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset Password OTP",
    html: `
      <h2>Reset Password</h2>
      <p>الـ OTP بتاعك هو:</p>
      <h1 style="color: #4CAF50; letter-spacing: 5px">${otp}</h1>
      <p>صالح لمدة 10 دقايق بس</p>
    `,
  });

  // شوف في الـ Railway logs إيه اللي بيطلع
  console.log("Resend response:", { data, error });

  if (error) {
    throw new Error(error.message);
  }
};
