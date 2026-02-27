/**
 * ============================================================
 * MODELS/DOCTOR.JS - Doctor Schema (Database Model)
 * ============================================================
 *
 * WHAT IS A MONGOOSE MODEL?
 * A model is a JavaScript class that represents a collection
 * in MongoDB. Think of it like a "table" in SQL databases.
 * Each document in the collection follows the "schema" we define.
 *
 * WHY DO WE HASH PASSWORDS?
 * We NEVER store plain-text passwords in the database.
 * If the database is hacked, plain passwords are immediately
 * exposed. Hashing converts a password into a random string
 * that CANNOT be reversed. When a user logs in, we hash their
 * input and compare it to the stored hash.
 *
 * bcryptjs does this for us with the .hash() and .compare() methods.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the structure (schema) for a Doctor document
const doctorSchema = new mongoose.Schema(
    {
        // Doctor's full name - required field
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true, // automatically removes leading/trailing spaces
        },

        // Doctor's email - must be unique across all doctors
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true, // MongoDB will reject duplicate emails
            lowercase: true, // always store email in lowercase
            trim: true,
        },

        // Doctor's hashed password
        // We NEVER store the raw password - only the bcrypt hash
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
    },
    {
        // timestamps: true automatically adds createdAt and updatedAt fields
        timestamps: true,
    }
);

/**
 * PRE-SAVE HOOK (Middleware)
 * This function runs automatically BEFORE a doctor document is saved.
 * We use it to hash the password before it ever touches the database.
 *
 * Why check isModified("password")?
 * If a doctor updates their name (not password), we don't want
 * to re-hash an already-hashed password. isModified() prevents that.
 */
doctorSchema.pre("save", async function (next) {
    // Only hash the password if it was changed/created
    if (!this.isModified("password")) {
        return next();
    }

    // Salt rounds = 10 means bcrypt does 2^10 = 1024 hashing iterations
    // Higher = more secure but slower. 10 is the industry standard.
    const salt = await bcrypt.genSalt(10);

    // Hash the plain-text password using the salt
    this.password = await bcrypt.hash(this.password, salt);

    next(); // Continue saving the document
});

/**
 * INSTANCE METHOD: matchPassword
 * We attach this method to every Doctor document.
 * It compares a plain-text password (from login form) to the stored hash.
 *
 * Usage: const isMatch = await doctor.matchPassword("enteredPassword");
 */
doctorSchema.methods.matchPassword = async function (enteredPassword) {
    // bcrypt.compare() hashes enteredPassword and compares to this.password
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the Doctor model
// mongoose.model("Doctor", doctorSchema) creates a "doctors" collection in MongoDB
module.exports = mongoose.model("Doctor", doctorSchema);
