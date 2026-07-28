const express = require("express");
const router = express.Router();
const {
  createTheme,
  getThemes,
  getThemeById,
  getThemeBySlug,
  updateTheme,
  deleteTheme,
} = require("../controllers/themeController");
const { protect, admin } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { themeSchema } = require("../validations/schemas");

// /api/themes
// GET is public (browse themes); POST requires an admin
router.route("/").get(getThemes).post(protect, admin, validate(themeSchema), createTheme);

// Get by slug — declared BEFORE "/:id" so "slug" isn't treated as an id
router.get("/slug/:slug", getThemeBySlug);

// /api/themes/:id
// GET is public; PUT and DELETE require an admin
router
  .route("/:id")
  .get(getThemeById)
  .put(protect, admin, validate(themeSchema), updateTheme)
  .delete(protect, admin, deleteTheme);

module.exports = router;
