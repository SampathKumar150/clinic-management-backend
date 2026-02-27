/**
 * ============================================================
 * ROUTES/AUTHROUTES.JS - Authentication Routes
 * ============================================================
 *
 * This file handles two routes:
 *   POST /api/auth/register → Create a new doctor account
 *   POST /api/auth/login    → Log in and receive a JWT token
 *
 * WHAT HAPPENS DURING LOGIN?
 * 1. Doctor sends their email & password
 * 2. We find the doctor by email in the database
 * 3. We compare the entered password to the stored hash (bcrypt)
 * 4. If they match → We create a JWT token and send it back
 * 5. The frontend stores this token and sends it with future requests
 *
 * WHAT IS IN THE JWT TOKEN?
 * We put the doctor's MongoDB _id inside the token payload.
 * When received later, we decode the token to get the doctorId.
 * This tells us WHO is making the request.
 */

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

/**
 * Helper function to generate a JWT token
 *
 * jwt.sign(payload, secret, options) creates a signed token.
 * payload = { id: doctorId } → What to store in the token
 * process.env.JWT_SECRET     → Secret key to sign (verify) the token
 * expiresIn: "1d"            → Token expires after 1 day
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// ============================================================
// POST /api/auth/register
// Register a new doctor account
// ============================================================
router.post("/register", async (req, res) => {
    try {
        // Extract name, email, password from the request body
        const { name, email, password } = req.body;

        // Basic validation - all fields are required
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        // Check if a doctor with this email already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create the new doctor
        // Password hashing happens automatically in the pre-save hook (Doctor.js)
        const doctor = await Doctor.create({ name, email, password });

        // Return success with a token so they can immediately be logged in
        res.status(201).json({
            message: "Doctor registered successfully",
            token: generateToken(doctor._id),
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
            },
        });
    } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// ============================================================
// POST /api/auth/login
// Log in an existing doctor
// ============================================================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Please provide email and password" });
        }

        // Find the doctor by email in the database
        const doctor = await Doctor.findOne({ email });

        // Security note: We say "invalid credentials" instead of
        // "email not found" to prevent attackers from discovering valid emails
        if (!doctor) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Use our matchPassword() method (defined in Doctor.js) to
        // compare the entered password with the stored bcrypt hash
        const isPasswordCorrect = await doctor.matchPassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Login successful! Send back a JWT token.
        res.status(200).json({
            message: "Login successful",
            token: generateToken(doctor._id),
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error during login" });
    }
});

module.exports = router;
