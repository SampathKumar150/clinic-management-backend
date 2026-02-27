/**
 * ============================================================
 * SERVER.JS - The entry point of our backend application
 * ============================================================
 *
 * This file does the following:
 * 1. Loads environment variables from .env file
 * 2. Creates an Express app (our web server)
 * 3. Connects to MongoDB (our database)
 * 4. Registers all routes (API endpoints)
 * 5. Starts listening on a port for incoming requests
 */

// Load environment variables from .env file into process.env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import our route files
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

// Create the Express application
const app = express();

// ============================================================
// MIDDLEWARE SETUP
// Middleware = functions that run on EVERY request before
// it reaches our route handlers. Think of it as a pipeline.
// ============================================================

// CORS (Cross-Origin Resource Sharing):
// Allows our React frontend (running on port 5173) to talk to
// our backend (running on port 5000). Without this, the browser
// would block the request for security reasons.
app.use(
  cors({
    origin: "http://localhost:5173", // Only allow requests from our React app
    credentials: true,
  })
);

// express.json() parses incoming requests with JSON bodies.
// Without this, req.body would be undefined.
app.use(express.json());

// ============================================================
// ROUTES
// Routes define what happens when someone hits a specific URL.
// We split them into separate files to keep code organized.
// ============================================================
app.use("/api/auth", authRoutes);           // /api/auth/register, /api/auth/login
app.use("/api/patients", patientRoutes);    // /api/patients (add, list)
app.use("/api/appointments", appointmentRoutes); // /api/appointments (book, list)

// A simple health check route to confirm the server is running
app.get("/", (req, res) => {
  res.json({ message: "Clinic Management API is running! 🏥" });
});

// ============================================================
// DATABASE CONNECTION
// We connect to MongoDB Atlas (cloud database) using Mongoose.
// Mongoose is an "ODM" (Object Document Mapper) that lets us
// work with MongoDB using JavaScript objects instead of raw queries.
// ============================================================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // Exit process with failure code if DB won't connect
    process.exit(1);
  }
};

// ============================================================
// START THE SERVER
// ============================================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); // Connect to DB first
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
