import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/auth";
import "./Login.css"; // use same CSS as login for layout

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    const res = await signupUser(form);
    setBusy(false);

    if (!res.ok) return setErr(res.message);

    // store email temporarily for OTP verification
    sessionStorage.setItem("pendingEmail", form.email);
    setMsg("OTP sent! Redirecting to verification...");
    setTimeout(() => navigate("/verify-otp"), 800);
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>URL Shortener</h1>
        <p>Shorten your links, track clicks, and manage URLs easily.</p>
        <div className="animation">
          <img src="/assets/download.png" alt="Link Animation" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <form className="card form" onSubmit={onSubmit}>
          <h2>Create Account</h2>
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
          />
          {err && <p className="error">{err}</p>}
          {msg && <p className="success">{msg}</p>}
          <button className="btn" disabled={busy}>
            {busy ? "Sending OTP..." : "Sign Up"}
          </button>
          <p className="muted">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
