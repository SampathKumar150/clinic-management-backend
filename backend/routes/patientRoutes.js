/**
 * ROUTES/PATIENTROUTES.JS - Patient Management Routes (Full CRUD)
 *
 * GET    /api/patients        → List all patients for logged-in doctor
 * POST   /api/patients        → Add a new patient
 * PUT    /api/patients/:id    → Update a patient
 * DELETE /api/patients/:id    → Delete a patient
 */

const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const { protect } = require("../middleware/auth");

// GET all patients for the logged-in doctor
router.get("/", protect, async (req, res) => {
    try {
        const patients = await Patient.find({ doctor: req.doctorId }).sort({ createdAt: -1 });
        res.status(200).json({ patients });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching patients" });
    }
});

// POST - Add a new patient
router.post("/", protect, async (req, res) => {
    try {
        const { name, age, disease } = req.body;
        if (!name || !age || !disease)
            return res.status(400).json({ message: "Please provide name, age, and disease" });

        const patient = await Patient.create({ name, age, disease, doctor: req.doctorId });
        res.status(201).json({ message: "Patient added successfully", patient });
    } catch (error) {
        res.status(500).json({ message: "Server error while adding patient" });
    }
});

// PUT /:id - Update a patient's details (only the owning doctor can update)
router.put("/:id", protect, async (req, res) => {
    try {
        const patient = await Patient.findOne({ _id: req.params.id, doctor: req.doctorId });
        if (!patient)
            return res.status(404).json({ message: "Patient not found or access denied" });

        const { name, age, disease } = req.body;
        if (name) patient.name = name;
        if (age !== undefined) patient.age = age;
        if (disease) patient.disease = disease;

        await patient.save();
        res.status(200).json({ message: "Patient updated successfully", patient });
    } catch (error) {
        res.status(500).json({ message: "Server error while updating patient" });
    }
});

// DELETE /:id - Delete a patient (only the owning doctor can delete)
router.delete("/:id", protect, async (req, res) => {
    try {
        const patient = await Patient.findOneAndDelete({ _id: req.params.id, doctor: req.doctorId });
        if (!patient)
            return res.status(404).json({ message: "Patient not found or access denied" });

        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting patient" });
    }
});

module.exports = router;
