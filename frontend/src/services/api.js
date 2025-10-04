import axios from "axios";

const api = axios.create({
  baseURL: "https://url-shortner-black-nine.vercel.app/api", // deployed backend URL
});

// Attach token automatically (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
