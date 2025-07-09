const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

/* CREATE CONTACT SUBMISSION */
router.post("/submit", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Input validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });
    
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    console.error("Error submitting contact form:", err);
    res.status(500).json({ message: "Server error occurred" });
  }
});

/* GET ALL CONTACT SUBMISSIONS (ADMIN) */
router.get("/all", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ message: "Server error occurred" });
  }
});

/* UPDATE CONTACT STATUS (ADMIN) */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    
    res.status(200).json(updatedContact);
  } catch (err) {
    console.error("Error updating contact status:", err);
    res.status(500).json({ message: "Server error occurred" });
  }
});

/* DELETE CONTACT SUBMISSION (ADMIN) */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ message: "Server error occurred" });
  }
});

module.exports = router; 