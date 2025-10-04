import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running in traditional Express mode!");
});

// Handle favicon.ico
app.get("/favicon.ico", (req, res) => res.status(204));

// ✅ Traditional server (NOT serverless)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
