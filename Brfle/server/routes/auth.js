const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { registerUser,loginUser,logoutUser,getCurrentUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);
router.post('/logout', logoutUser);
// get me
router.get('/me', getCurrentUser);

module.exports = router;
