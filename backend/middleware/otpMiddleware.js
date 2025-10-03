const otpMiddleware = (req, res, next) => {
  if (!req.body.otp) {
    return res.status(400).json({ message: "OTP is required" });
  }
  next();
};

export default otpMiddleware;
