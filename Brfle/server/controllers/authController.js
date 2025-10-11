const jwt = require('jsonwebtoken');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const {generateToken} = require('../middleware/jwtToken');

const registerUser = async (req, res) => {
  const { FullName, email, password, role } = req.body;

  try {
    // Validation
    if (!FullName || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide FullName, email, and password' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      FullName,
      email,
      password,
      role: role || 'student',
    });

    console.log("User created:", user);

    // Generate token
    const token = generateToken(user._id);

    // ✅ FIXED: Return consistent structure with nested user object
    res.status(201).json({
      user: {  // ✅ Wrap user data in user object
        _id: user._id,
        FullName: user.FullName,
        email: user.email,
        role: user.role,
      },
      token: token,
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} already exists` 
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages.join(', ') 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

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
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ FIXED: Return consistent structure with nested user object
    res.status(200).json({
      user: {  // ✅ Wrap user data in user object
        _id: user._id,
        FullName: user.FullName,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
      token: generateToken(user._id),
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const logoutUser = async (req, res) => {
  try {
    console.log(`User ${req.user?._id} logged out`);
    
    res.status(200).json({ 
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // ✅ FIXED: Return consistent structure
    res.status(200).json({
      user: {  // ✅ Wrap user data in user object
        _id: user._id,
        FullName: user.FullName,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
};