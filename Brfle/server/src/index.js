// ==========================
// Load environment variables first
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ==========================
// Import required packages
const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db");

// ==========================
// Import routes
const authRoutes = require("../routes/auth");
const adminRoutes = require("../routes/admin");
const coursesRoutes = require("../routes/courseRoutes");
const paymentRoutes = require("../routes/payment"); // ✅ Added payment route
const certificateRoutes = require("../routes/certificateRoutes");

// ==========================
// Initialize Express app
const app = express();

// ==========================
// Debug environment variables
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);

// ==========================
// Connect to MongoDB
connectDB();

// ==========================
// Middleware
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse incoming JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Debug middleware (for development)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.body).length) {
    console.log("Request Body:", req.body);
  }
  next();
});

// ==========================
// API Routes
app.use("/api/hello", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/payment", paymentRoutes); // ✅ Added payment route here
app.use("/api/certificates", certificateRoutes); // Certificate routes

// ==========================
// Default route for testing
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ==========================
// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ==========================
// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ==========================
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
