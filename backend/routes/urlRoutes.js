import express from "express";
import {
  createUrl,
  getUserUrls,
  redirectUrl,
  deleteUrl,
} from "../controllers/urlController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/shorten", protect, createUrl);
router.get("/", protect, getUserUrls);
router.get("/:code", redirectUrl); // Added redirect route
router.delete("/:id", protect, deleteUrl); // Added delete route

export default router;
