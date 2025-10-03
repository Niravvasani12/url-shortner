import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { verifyOtp } from "../services/auth";
import "./VerifyOtp.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const e = sessionStorage.getItem("pendingEmail");
    if (!e) return navigate("/signup");
    setEmail(e);
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    const res = await verifyOtp({ email, otp });
    setBusy(false);

    if (!res.ok) return setErr(res.message);
    setMsg("Verified! You can login now.");
    sessionStorage.removeItem("pendingEmail");
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <div className="verify-otp-page">
      {/* LEFT SIDE */}
      <div className="verify-otp-left">
        <h1>URL Shortener</h1>
        <p>
          Secure verification for your account. Enter the OTP sent to your
          email.
        </p>
        <div className="animation">
          <img src="/assets/download.png" alt="Verification Animation" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="verify-otp-right">
        <form className="card form" onSubmit={onSubmit}>
          <h2>Verify your email</h2>
          <p className="muted">
            OTP was sent to <b>{email}</b>
          </p>
          <input
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {err && <p className="error">{err}</p>}
          {msg && <p className="success">{msg}</p>}
          <button className="btn" disabled={busy}>
            {busy ? "Verifying..." : "Verify"}
          </button>
          <p className="muted">
            <Link to="/signup">Edit email</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
