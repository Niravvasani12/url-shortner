import Url from "../models/Url.js";
import shortid from "shortid";

// Create short URL
export const createUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.user.id;

    console.log("Creating URL for user:", userId, "URL:", originalUrl);

    if (!originalUrl) {
      return res.status(400).json({ msg: "Original URL required" });
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (urlError) {
      return res.status(400).json({ msg: "Invalid URL format" });
    }

    // Check if already exists FOR THIS USER
    const existing = await Url.findOne({ originalUrl, userId });
    if (existing) {
      console.log("URL already exists:", existing);
      return res.json(existing);
    }

    // Generate unique short code with retry logic
    let shortCode;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      shortCode = shortid.generate();
      console.log("Generated shortCode:", shortCode);

      const existingCode = await Url.findOne({ shortCode });
      if (!existingCode) {
        isUnique = true;
      } else {
        attempts++;
        console.log("Short code exists, trying again...");
      }
    }

    if (!isUnique) {
      return res
        .status(500)
        .json({ msg: "Failed to generate unique short code" });
    }

    const shortUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/url/${shortCode}`;

    console.log("Creating new URL with:", {
      originalUrl,
      shortUrl,
      shortCode,
      userId,
    });

    const newUrl = new Url({
      originalUrl,
      shortUrl,
      shortCode,
      userId,
    });

    await newUrl.save();
    console.log("URL saved successfully:", newUrl);

    res.status(201).json(newUrl);
  } catch (err) {
    console.error("Error creating short URL:", err);

    // Handle duplicate key error specifically
    if (err.code === 11000) {
      console.error("Duplicate key error details:", err.keyValue);
      return res.status(400).json({
        msg: "Short code conflict. Please try again.",
        error: "Duplicate short code",
      });
    }

    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

//  Get user's URLs
export const getUserUrls = async (req, res) => {
  try {
    const userId = req.user.id;
    const urls = await Url.find({ userId }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

//  Redirect short URL to original
export const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    console.log("Redirecting for code:", code);

    const url = await Url.findOne({ shortCode: code });
    if (!url) {
      return res.status(404).json({ msg: "URL not found" });
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    console.log("Redirecting to:", url.originalUrl);
    return res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Delete URL
// its all about to delete the url from database
export const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const url = await Url.findOne({ _id: id, userId });
    if (!url) {
      return res.status(404).json({ msg: "URL not found" });
    }

    await Url.findByIdAndDelete(id);
    res.json({ msg: "URL deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
