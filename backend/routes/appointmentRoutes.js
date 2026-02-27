/**
 * ROUTES/APPOINTMENTROUTES.JS - Appointment Management Routes (Full CRUD)
 *
 * GET    /api/appointments        → List all appointments for logged-in doctor
 * POST   /api/appointments        → Book a new appointment
 * PUT    /api/appointments/:id    → Update an appointment (date, notes, status)
 * DELETE /api/appointments/:id    → Delete an appointment
 */

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const { protect } = require("../middleware/auth");

// GET all appointments for the logged-in doctor
router.get("/", protect, async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.doctorId })
            .populate("patient", "name age disease")
            .sort({ date: 1 });
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching appointments" });
    }
});

// POST - Book a new appointment
router.post("/", protect, async (req, res) => {
    try {
        const { patientId, date, notes } = req.body;
        if (!patientId || !date)
            return res.status(400).json({ message: "Please provide patientId and date" });

        const patient = await Patient.findOne({ _id: patientId, doctor: req.doctorId });
        if (!patient)
            return res.status(404).json({ message: "Patient not found or does not belong to you" });

        const appointment = await Appointment.create({
            patient: patientId,
            doctor: req.doctorId,
            date: new Date(date),
            notes: notes || "",
        });
        await appointment.populate("patient", "name age disease");
        res.status(201).json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: "Server error while booking appointment" });
    }
});

// PUT /:id - Update an appointment (date, notes, status)
router.put("/:id", protect, async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ _id: req.params.id, doctor: req.doctorId });
        if (!appointment)
            return res.status(404).json({ message: "Appointment not found or access denied" });

        const { date, notes, status } = req.body;
        if (date) appointment.date = new Date(date);
        if (notes !== undefined) appointment.notes = notes;
        if (status) appointment.status = status;

        await appointment.save();
        await appointment.populate("patient", "name age disease");
        res.status(200).json({ message: "Appointment updated successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: "Server error while updating appointment" });
    }
});

// DELETE /:id - Delete an appointment
router.delete("/:id", protect, async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndDelete({
            _id: req.params.id,
            doctor: req.doctorId,
        });
        if (!appointment)
            return res.status(404).json({ message: "Appointment not found or access denied" });

        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting appointment" });
    }
});

module.exports = router;
