import nodemailer from "nodemailer";

export const sendOtpMail = async (to, otp) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailFrom = process.env.EMAIL_FROM || emailUser;

    if (!emailUser || !emailPass) {
      throw new Error("Email configuration is missing");
    }

    const transporter = process.env.SMTP_HOST
      ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        })
      : nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

    await transporter.verify();

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
