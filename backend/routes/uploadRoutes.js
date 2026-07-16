const express = require("express");
const multer = require("multer");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");
const { protect, admin } = require("../middleware/authMiddleware");

// Store the uploaded file in memory (we forward it straight to Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Admin-only. "image" must match the form-data field name.
router.post("/", protect, admin, upload.single("image"), uploadImage);

module.exports = router;
