const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
});

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String }, // filename or path
  lessons: [lessonSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);
