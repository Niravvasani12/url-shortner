import { deleteUrl } from "../services/url";
import "./UrlList.css";
const UrlList = ({ items, onDelete, onRefresh }) => {
  const handleDelete = async (urlId) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) {
      return;
    }

    try {
      await deleteUrl(urlId);
      onDelete(urlId);
    } catch (error) {
      console.error("Error deleting URL:", error);
      alert("Failed to delete URL. Please try again.");
    }
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (items.length === 0) {
    return (
      <div className="url-empty-state">
        <p>No URLs found. Create your first short URL above!</p>
        <button onClick={onRefresh} className="refresh-btn">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="url-grid-container">
      <h3 className="url-grid-title">Your Short URLs ({items.length})</h3>
      <div className="url-grid">
        {items.map((url) => (
          <div key={url._id} className="url-card">
            <div className="url-card-content">
              <div className="url-field original-url">
                <span className="field-label">Original URL</span>
                <span className="field-value">{url.originalUrl}</span>
              </div>

              <div className="url-field short-url">
                <span className="field-label">Short URL</span>
                <a
                  href={url.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-link"
                >
                  {url.shortUrl}
                </a>
              </div>

              <div className="url-field created-at">
                <span className="field-label">Created</span>
                <span className="field-value">
                  {formatDateTime(url.createdAt)}
                </span>
              </div>

              <div className="url-card-actions">
                <button
                  onClick={() => handleDelete(url._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlList;
