const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/courses", authMiddleware, async (req, res) => {
  try {
    const userCourses = await Course.find({ enrolledUsers: req.user.id });
    res.json(userCourses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
