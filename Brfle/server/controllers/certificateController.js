const Certificate = require("../model/Certificate");
const User = require("../model/User");
const Course = require("../model/Course");
const path = require("path");
const fs = require("fs");

// @desc Generate a certificate
// @route POST /api/certificates/generate
// @access Private (Admin or system)
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or Course not found" });
    }

    // Generate fake PDF path (replace with actual PDF generation)
    const pdfPath = path.join(__dirname, "../certificates", `${userId}-${courseId}.pdf`);
    const pdfUrl = `http://localhost:5000/certificates/${userId}-${courseId}.pdf`;
    const verificationUrl = `http://localhost:5000/api/certificates/${userId}-${courseId}/verify`;

    // Create certificate
    const certificate = await Certificate.create({
      certificateId: `CERT-${Date.now()}`,
      user: userId,
      course: courseId,
      studentName: user.FullName,
      courseName: course.title,
      completionDate: new Date(),
      pdfPath,
      pdfUrl,
      verificationUrl,
      metadata: { triggeredBy: req.user._id },
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate certificate", error: error.message });
  }
};

// @desc Download certificate
// @route GET /api/certificates/:certificateId/download
// @access Private
exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findById(certificateId);

    if (!certificate) return res.status(404).json({ message: "Certificate not found" });

    // Check if PDF exists
    if (!fs.existsSync(certificate.pdfPath)) {
      return res.status(404).json({ message: "PDF file not found" });
    }

    res.download(certificate.pdfPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to download certificate", error: error.message });
  }
};

// @desc Verify certificate
// @route GET /api/certificates/:certificateId/verify
// @access Public
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findById(certificateId);

    if (!certificate) return res.status(404).json({ message: "Certificate not found" });

    // Increment verification count
    certificate.metadata.verificationCount = (certificate.metadata.verificationCount || 0) + 1;
    certificate.metadata.lastVerifiedAt = new Date();
    await certificate.save();

    res.json({ valid: certificate.isValid, certificate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify certificate", error: error.message });
  }
};
