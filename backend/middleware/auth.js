/**
 * ============================================================
 * MIDDLEWARE/AUTH.JS - JWT Authentication Middleware
 * ============================================================
 *
 * WHAT IS MIDDLEWARE?
 * Middleware is a function that sits between the incoming HTTP
 * request and your route handler. It can:
 *   - Read/modify the request
 *   - End the request early (e.g., reject unauthorized users)
 *   - Pass control to the next handler using next()
 *
 * WHAT IS JWT (JSON Web Token)?
 * JWT is a compact, self-contained token used for authentication.
 * When a doctor logs in, we create a JWT that contains their ID.
 * The frontend stores this token and sends it with every request.
 * We verify the token here to know WHO is making the request.
 *
 * Structure of a JWT: header.payload.signature
 * Example: eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMyJ9.ABC123
 *
 * HOW DOES THIS PROTECT ROUTES?
 * Any route that requires login simply uses this middleware.
 * If token is missing or invalid → request is rejected (401).
 * If token is valid → doctorId is attached to req, route proceeds.
 */

const jwt = require("jsonwebtoken");

/**
 * protect - Middleware function to verify JWT tokens
 *
 * @param {Object} req - The incoming HTTP request
 * @param {Object} res - The outgoing HTTP response
 * @param {Function} next - Call this to proceed to the route handler
 */
const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with "Bearer"
    // Format: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.xxxxx
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract just the token part (remove "Bearer " prefix)
            token = req.headers.authorization.split(" ")[1];

            // Verify the token using our secret key
            // If the token was tampered with or expired, this will throw an error
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the doctorId from the token payload to the request object
            // Now any route handler can access req.doctorId to know who's logged in
            req.doctorId = decoded.id;

            // Call next() to proceed to the actual route handler
            next();
        } catch (error) {
            // Token is invalid or expired
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    // No token was found in the headers
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };
