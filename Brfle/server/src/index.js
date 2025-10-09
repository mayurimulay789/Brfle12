require("dotenv").config();
console.log("Loaded keys:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('../routes/auth');
const adminRoutes = require('../routes/admin');
const courseRoutes = require("../routes/courseRoutes");
const paymentRoutes = require("../routes/paymentRoutes");
const certificateRoutes = require("../routes/certificateRoutes");
const userRoutes = require('../routes/userRoutes');



dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded bodies

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
app.use('/api/auth', require('../routes/auth'));
app.use('/api/users', userRoutes);
// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});
 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
