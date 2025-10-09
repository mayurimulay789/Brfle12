const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL of PDF/image
  issuedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Certificate", certificateSchema);
