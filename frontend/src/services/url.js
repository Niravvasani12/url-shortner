import api from "./api";

// ✅ Create a short URL
export const createShortUrl = async (originalUrl) => {
  const res = await api.post("/url/shorten", { originalUrl });
  return res.data;
};

// ✅ Fetch user's URLs
export const fetchMyUrls = async () => {
  const res = await api.get("/url");
  return res.data;
};

// ✅ Delete a URL
export const deleteUrl = async (urlId) => {
  const res = await api.delete(`/url/${urlId}`);
  return res.data;
};

// ✅ Get URL analytics
export const getUrlStats = async (urlId) => {
  const res = await api.get(`/url/${urlId}/stats`);
  return res.data;
};
