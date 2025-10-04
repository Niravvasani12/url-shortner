import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import serverless from "serverless-http";

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

// Root route (important for testing on vercel)
app.get("/", (req, res) => {
  res.send("🚀 Backend is running on Vercel!");
});

// Handle favicon.ico
app.get("/favicon.ico", (req, res) => res.status(204));

// ❌ REMOVE app.listen()
// ✅ Only export for serverless
export const handler = serverless(app);
export default app;
