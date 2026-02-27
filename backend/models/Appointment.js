/**
 * ============================================================
 * MODELS/APPOINTMENT.JS - Appointment Schema (Database Model)
 * ============================================================
 *
 * An Appointment links a Patient to a Doctor with a date & notes.
 *
 * This model references BOTH Patient and Doctor, showing how
 * complex relationships work in MongoDB.
 */

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        // Reference to the Patient for this appointment
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: [true, "Patient is required for appointment"],
        },

        // Reference to the Doctor managing this appointment
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        // Date and time of the appointment
        date: {
            type: Date,
            required: [true, "Appointment date is required"],
        },

        // Optional notes or reason for the appointment
        notes: {
            type: String,
            trim: true,
            default: "", // If no notes provided, default to empty string
        },

        // Status of the appointment
        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"], // Only these 3 values allowed
            default: "scheduled",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
