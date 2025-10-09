const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    benefits: { type: [String], required: true },
    guideName: { type: String, required: true },
    duration: { type: String, required: true },
    prize: { type: String, required: true }, // ✅ changed from fees to prize
    mode: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
