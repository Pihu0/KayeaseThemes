const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { categorySchema } = require("../validations/schemas");

// GET is public; POST requires an admin
router.route("/").get(getCategories).post(protect, admin, validate(categorySchema), createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, admin, validate(categorySchema), updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
