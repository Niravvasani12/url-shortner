import nodemailer from "nodemailer";

export const sendOtpMail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.   send by Nirav Vasani`,
    });

    console.log("✅ OTP email sent to", to);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};
