require("dotenv").config();
console.log("Loaded keys:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Add this missing import
const connectDB = require('./config/db');
const authRoutes = require('../routes/auth');
const adminRoutes = require('../routes/admin');
const courseRoutes = require("../routes/courseRoutes");
const paymentRoutes = require("../routes/paymentRoutes");
const certificateRoutes = require("../routes/certificateRoutes");
const userRoutes = require('../routes/userRoutes');
// Remove chatRoutes if you don't need it, or add the import if you do
// const chatRoutes = require('../routes/chatRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Debug middleware to log request body
app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use('/api/users', userRoutes);
// Add chatRoutes back if needed:
// app.use('/api/chat', chatRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Keep the environment logging if you want it:
  console.log('Environment variables loaded:', {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI ? 'Loaded' : 'Missing'
  });
});