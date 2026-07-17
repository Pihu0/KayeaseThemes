require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// CORS — only allow requests from our own frontends (browser cross-origin).
// CLIENT_URL can be a comma-separated list to allow several origins
// (e.g. apex + www, or preview + production): "https://kayease.com,https://www.kayease.com"
const allowedOrigins = [
  "http://localhost:3000",
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
    : []),
].filter(Boolean);

// If CLIENT_URL is configured, restrict to the allowed origins.
// If not (e.g. env var forgotten), fall back to allowing all — so a missing
// var never locks the frontend out. Set CLIENT_URL to activate the lockdown.
app.use(
  cors(
    process.env.CLIENT_URL
      ? { origin: allowedOrigins, credentials: true }
      : { origin: true, credentials: true }
  )
);
app.use(express.json());

// Health-check route
app.get("/", (req, res) => {
  res.json({ message: "Kayease Themes API is running" });
});

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/themes", require("./routes/themeRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
