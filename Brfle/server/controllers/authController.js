const jwt = require('jsonwebtoken');
const User = require('../model/User');
const bcrypt = require('bcryptjs');;
const {generateToken} =require('../middleware/jwtToken');

  const registerUser=async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    //hashed password

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword",hashedPassword);

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'student',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Find user by email and select password field explicitly
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      // Don't specify whether email or password was wrong (security best practice)
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login timestamp (optional)
    // user.lastLogin = new Date();
    await user.save();

    // Return user data (excluding password)
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};



const logoutUser = async (req, res) => {
  try {
    console.log(`User ${req.user._id} logged out`);
    
    res.status(200).json({ 
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
    registerUser,
    loginUser ,
    logoutUser
 };



  

