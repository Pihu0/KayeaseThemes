const Contact = require("../models/Contact");

// @desc   Submit a contact message
// @route  POST /api/contacts   (public)
const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res
      .status(201)
      .json({ message: "Message sent successfully", contact });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get all contact messages
// @route  GET /api/contacts   (admin)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update a contact message (e.g. toggle isRead)
// @route  PATCH /api/contacts/:id   (admin)
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete a contact message
// @route  DELETE /api/contacts/:id   (admin)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContact, getContacts, updateContact, deleteContact };
