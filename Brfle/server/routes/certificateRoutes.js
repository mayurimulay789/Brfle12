const express = require("express");
const router = express.Router();
const Certificate = require("../models/certificate");
const authMiddleware = require("../middleware/authMiddleware");

// GET: certificates for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user.id });
    res.json(certificates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Admin uploads a certificate
router.post("/", authMiddleware, async (req, res) => {
  const { userId, courseName, fileUrl } = req.body;
  try {
    const cert = await Certificate.create({ user: userId, courseName, fileUrl });
    res.status(201).json(cert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
