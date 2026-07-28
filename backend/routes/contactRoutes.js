const express = require("express");
const router = express.Router();
const {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const { protect, admin } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { createContactSchema, updateContactSchema } = require("../validations/schemas");

// POST is public (anyone can send a message); GET is admin-only
router.route("/").post(validate(createContactSchema), createContact).get(protect, admin, getContacts);

router.route("/:id").patch(protect, admin, validate(updateContactSchema), updateContact).delete(protect, admin, deleteContact);

module.exports = router;
