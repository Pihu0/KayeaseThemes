const express = require("express");
const router = express.Router();
const {
  createContact,
  getContacts,
  deleteContact,
} = require("../controllers/contactController");
const { protect, admin } = require("../middleware/authMiddleware");

// POST is public (anyone can send a message); GET is admin-only
router.route("/").post(createContact).get(protect, admin, getContacts);

router.route("/:id").delete(protect, admin, deleteContact);

module.exports = router;
