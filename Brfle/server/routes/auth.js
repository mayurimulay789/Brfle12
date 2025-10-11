const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { registerUser,loginUser,logoutUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;
