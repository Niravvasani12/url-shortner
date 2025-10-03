import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import UrlForm from "../components/UrlForm";
import UrlList from "../components/UrlList";
import { fetchMyUrls } from "../services/url";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUrls = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMyUrls();
      setUrls(data);
    } catch (err) {
      console.error("Error loading URLs:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load URLs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUrls();
  }, []);

  const handleUrlCreated = (newUrl) => {
    setUrls((prev) => [newUrl, ...prev]);
    setError(""); // Clear any previous errors
  };

  const handleUrlDeleted = (urlId) => {
    setUrls((prev) => prev.filter((url) => url._id !== urlId));
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>URL Shortener Dashboard</h1>
        <p className="welcome-message">
          Welcome{user?.name ? `, ${user.name}` : ""}! Create short links and
          manage all your URLs.
        </p>
      </div>

      {/* Main Content - Single Column Layout */}
      <div className="dashboard-content">
        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
            <button onClick={loadUrls} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* URL Form */}
        <div className="url-form-section">
          <UrlForm onCreated={handleUrlCreated} />
        </div>

        {/* URL List */}
        <div className="url-list-section">
          {loading ? (
            <div className="loading-state">
              <p>Loading your links...</p>
            </div>
          ) : (
            <UrlList
              items={urls}
              onDelete={handleUrlDeleted}
              onRefresh={loadUrls}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
