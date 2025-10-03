import api from "./api";

export const signupUser = async (data) => {
  // data: { name, email, password }
  try {
    const res = await api.post("/auth/signup", data);
    return { ok: true, message: res.data?.msg };
  } catch (err) {
    return { ok: false, message: err.response?.data?.msg || "Signup failed" };
  }
};

export const verifyOtp = async ({ email, otp }) => {
  try {
    const res = await api.post("/auth/verify-otp", { email, otp });
    return { ok: true, message: res.data?.msg };
  } catch (err) {
    return { ok: false, message: err.response?.data?.msg || "OTP failed" };
  }
};

export const loginUser = async (data) => {
  // data: { email, password }
  try {
    const res = await api.post("/auth/login", data);
    // { token, user: { id, name, email } }
    return { ok: true, ...res.data };
  } catch (err) {
    return { ok: false, message: err.response?.data?.msg || "Login failed" };
  }
};
