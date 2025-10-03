import { useState } from "react";
import { createShortUrl } from "../services/url";

const UrlForm = ({ onCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!originalUrl.trim()) {
      return setError("Please enter a URL");
    }

    try {
      setBusy(true);
      const newUrl = await createShortUrl(originalUrl.trim());

      setOriginalUrl("");
      onCreated?.(newUrl);
    } catch (err) {
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to shorten URL");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <form className="card" onSubmit={handleSubmit}>
        <h3>Create Short URL</h3>
        <input
          type="url"
          placeholder="https://example.com/very/long/link"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>
          {busy ? "Shortening..." : "Shorten"}
        </button>
      </form>
    </div>
  );
};

export default UrlForm;
