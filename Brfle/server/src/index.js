// // ==========================
// // Load environment variables first
// const dotenv = require("dotenv");
// const path = require("path");
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

// // ==========================
// // Import required packages
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("../config/db");

// // ==========================
// // Import routes
// const authRoutes = require("../routes/auth");
// const adminRoutes = require("../routes/admin");
// const coursesRoutes = require("../routes/courseRoutes");
// const paymentRoutes = require("../routes/paymentRoute"); // ✅ Added payment route
// const  enrollmentRoutes= require("../routes/enrollmentRoute"); 
// // const certificateRoutes = require("../routes/certificateRoutes");
// const lessonRoutes = require("../routes/lessonsRoutes");



// // ==========================
// // Initialize Express app
// const app = express();

// // ==========================
// // Debug environment variables
// console.log("PORT:", process.env.PORT);
// console.log("MONGO_URI:", process.env.MONGO_URI);

// // ==========================
// // Connect to MongoDB
// connectDB();

// // ==========================
// // Middleware
// app.use(cors()); // Enable cross-origin requests
// app.use(express.json()); // Parse incoming JSON
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// // Debug middleware (for development)
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
//   // FIXED: More robust check
//   if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
//     console.log("Request Body:", req.body);
//   } else {
//     console.log("Request Body: [empty or undefined]");
//   }
  
//   next();
// });

// // ==========================
// // API Routes
// app.use("/api/hello", (req, res) => {
//   res.send("Hello from the server!");
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/courses", coursesRoutes);
// app.use("/api/payment", paymentRoutes); // ✅ Added payment route here
// app.use("/api/enrollments", enrollmentRoutes)
// // app.use("/api/certificates", certificateRoutes); // Certificate routes
// app.use("/api/lessons", lessonRoutes); // Lesson routes

// // ==========================
// // Default route for testing
// app.get("/", (req, res) => {
//   res.send("Server is running ✅");
// });

// // ==========================
// // Handle 404 - Route not found
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // ==========================
// // Global error handler
// app.use((err, req, res, next) => {
//   console.error("Global error handler:", err.stack);
//   res.status(500).json({ message: "Internal Server Error" });
// });

// // ==========================
// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running at: http://localhost:${PORT}`);
// });



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
const paymentRoutes = require("../routes/paymentRoute");
const enrollmentRoutes = require("../routes/enrollmentRoute"); 
const lessonRoutes = require("../routes/lessonsRoutes");

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
// Middleware - IMPORTANT: Order matters!
app.use(cors()); // Enable cross-origin requests

// Debug middleware - placed BEFORE body parsers
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Log headers to see content-type
  console.log("Content-Type:", req.headers['content-type']);
  
  next();
});

// Body parsers - for JSON and URL-encoded data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ==========================
// API Routes
app.use("/api/hello", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);

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
  console.error("Global error handler:", err);
  console.error("Error stack:", err.stack);
  
  // Handle Multer errors specifically
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected field'
    });
  }
  
  res.status(500).json({ 
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==========================
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});