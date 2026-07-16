require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
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
