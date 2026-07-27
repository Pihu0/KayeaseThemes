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

// Restrict browser cross-origin requests to our known frontends. localhost is
// always allowed for local dev; production origins come from CLIENT_URL.
// We fail CLOSED: if CLIENT_URL is forgotten in prod, only localhost is allowed
// rather than every origin on the internet — a missing var should never widen
// access. Requests with no Origin header (curl, server-to-server, health
// checks) are still allowed through.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
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

// Catch-all error handler — registered AFTER all routes so any error thrown
// (or passed to next(err)) in a controller lands here instead of crashing the
// process or leaking a stack trace to the client.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
