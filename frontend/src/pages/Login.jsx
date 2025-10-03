import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";
const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const res = await loginUser(form);
    setBusy(false);

    if (!res.ok) return setErr(res.message);
    login({ user: res.user, token: res.token });
    navigate("/");
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>URL Shortener</h1>
        <p>Shorten your links, track clicks, and manage URLs easily.</p>
        <div className="animation">
          {/* You can add Lottie animation, SVG, or GIF here */}

          <img src="/assets/download.png" alt="Link Animation" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <form className="card form" onSubmit={onSubmit}>
          <h2>Login</h2>
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
            autoComplete="current-password"
            value={form.password}
            onChange={onChange}
          />
          {err && <p className="error">{err}</p>}
          <button className="btn" disabled={busy}>
            {busy ? "Logging in..." : "Login"}
          </button>
          <p className="muted">
            New here? <Link to="/signup">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
