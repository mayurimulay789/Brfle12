const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { registerUser,loginUser,logoutUser,getCurrentUser,updateUserProfile } = require('../controllers/authController');
const { upload } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);
router.post('/logout', logoutUser);
// get me
router.get('/me', protect, getCurrentUser);
router.put('/me', protect, upload.single('profileImage'), updateUserProfile);


module.exports = router;
