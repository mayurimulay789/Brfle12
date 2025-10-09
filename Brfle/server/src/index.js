const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env variables from parent directory (server folder)
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const authRoutes = require('../routes/auth');
const adminRoutes = require('../routes/admin');
const chatRoutes = require('../routes/chat');

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
app.use('/api/chat', chatRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables loaded:', {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI ? 'Loaded' : 'Missing'
  });
});