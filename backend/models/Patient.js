/**
 * ============================================================
 * MODELS/PATIENT.JS - Patient Schema (Database Model)
 * ============================================================
 *
 * HOW DO MONGODB REFERENCES WORK?
 * In SQL databases, we use FOREIGN KEYS to link tables.
 * In MongoDB with Mongoose, we use "references" (ref).
 *
 * Here, each Patient document has a `doctor` field that stores
 * the ObjectId of the doctor who created it.
 *
 * When we query patients, we can use .populate("doctor") to
 * replace the ObjectId with the actual Doctor document.
 *
 * This is like a JOIN in SQL, but for MongoDB!
 *
 * Example Patient Document in MongoDB:
 * {
 *   _id: ObjectId("64abc..."),
 *   name: "John Doe",
 *   age: 35,
 *   disease: "Hypertension",
 *   doctor: ObjectId("64xyz...")  ← This is the reference!
 * }
 */

const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        // Patient's full name
        name: {
            type: String,
            required: [true, "Patient name is required"],
            trim: true,
        },

        // Patient's age
        age: {
            type: Number,
            required: [true, "Patient age is required"],
            min: [0, "Age cannot be negative"],
            max: [150, "Age seems too high"],
        },

        // The disease/condition the patient has
        disease: {
            type: String,
            required: [true, "Disease/condition is required"],
            trim: true,
        },

        // Reference to the Doctor who created this patient record.
        // type: mongoose.Schema.Types.ObjectId → This stores a MongoDB ObjectId
        // ref: "Doctor" → This tells Mongoose which model to reference
        // This creates a "relationship" between Patient and Doctor.
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
    },
    {
        timestamps: true, // adds createdAt, updatedAt automatically
    }
);

module.exports = mongoose.model("Patient", patientSchema);
