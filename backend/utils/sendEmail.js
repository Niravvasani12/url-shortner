import nodemailer from "nodemailer";

let transporter;

export const isEmailConfigured = () => {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("EMAIL_USER/EMAIL_PASS are not configured");
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

export const sendOtpMail = async (to, otp) => {
  try {
    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    if (!transporter) {
      transporter = createTransporter();
      await transporter.verify();
    }

    await transporter.sendMail({
      from: emailFrom,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    console.log("OTP email sent to", to);
  } catch (err) {
    console.error("Email sending failed:", err.message);
    throw new Error("Unable to send OTP email");
  }
};