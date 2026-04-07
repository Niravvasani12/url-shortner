import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtpMail } from "../utils/sendEmail.js";
import { generateOtp } from "../utils/generateOtp.js";

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const normalizeEmail = (email = "") => email.trim().toLowerCase();

// Signup -> send OTP
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ msg: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser?.isVerified) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + OTP_EXPIRY_MS);

    const user = existingUser || new User();
    user.name = name.trim();
    user.email = normalizedEmail;
    user.password = hashedPassword;
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.isVerified = false;

    await sendOtpMail(normalizedEmail, otp);
    await user.save();

    res.json({ msg: "OTP sent to your email. Please verify." });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);

    if (!normalizedEmail) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.isVerified) {
      return res.status(400).json({ msg: "Account is already verified" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + OTP_EXPIRY_MS);

    // await sendOtpMail(normalizedEmail, otp);
    await user.save();

    res.json({ msg: "A new OTP has been sent to your email." });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ msg: "Account verified successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.isVerified) {
      return res.status(401).json({ msg: "Please verify your account first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
