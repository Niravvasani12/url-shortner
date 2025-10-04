// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import urlRoutes from "./routes/urlRoutes.js";

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/url", urlRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`--*-#--> Server running on port ${PORT}`));
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// Handle favicon.ico (to stop 500s)
app.get("/favicon.ico", (req, res) => res.status(204));

// ❌ Remove app.listen()
// ✅ Export app & handler for Vercel
export const handler = serverless(app);
export default app;
