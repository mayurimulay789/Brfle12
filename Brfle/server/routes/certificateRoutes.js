const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  generateCertificate,
  downloadCertificate,
  verifyCertificate,
} = require("../controllers/certificateController");

// Generate certificate (admin/system)
router.post("/generate", protect, generateCertificate);

// Download certificate
router.get("/:certificateId/download", protect, downloadCertificate);

// Verify certificate (public)
router.get("/:certificateId/verify", verifyCertificate);

module.exports = router;
