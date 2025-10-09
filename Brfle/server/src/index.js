// index.js
// ==========================
// Load environment variables first
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });


// Import required packages
const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db"); // Make sure path matches your folder structure
const authRoutes = require("../routes/auth");
const adminRoutes = require("../routes/admin");

// Initialize Express app
const app = express();

// ==========================
// Debug: check environment variables
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);

// ==========================
// Connect to MongoDB
connectDB();

// ==========================
// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Debug middleware to log request body
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request Body:", req.body);
  next();
});

// ==========================
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Default route for testing
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ==========================
// Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ==========================
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
