/**
 * PAGES/DASHBOARD.JSX — Main Doctor Dashboard (Full CRUD)
 *
 * Features:
 *  - Add / Edit / Delete Patients
 *  - Book / Edit / Delete Appointments
 *  - Edit/Delete via modal dialogs
 *  - JWT sent on every protected request
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

// ── Helper: build Authorization header ──────────────────────
const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// ── Edit Patient Modal Component ─────────────────────────────
function EditPatientModal({ patient, onClose, onSave }) {
    const [name, setName] = useState(patient.name);
    const [age, setAge] = useState(patient.age);
    const [disease, setDisease] = useState(patient.disease);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await onSave(patient._id, { name, age: parseInt(age), disease });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit Patient</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="dashboard-form">
                    <div className="form-group">
                        <label>Patient Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Age</label>
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min="0" required />
                    </div>
                    <div className="form-group">
                        <label>Disease / Condition</label>
                        <input value={disease} onChange={(e) => setDisease(e.target.value)} required />
                    </div>
                    {error && <div className="message message-error">{error}</div>}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Edit Appointment Modal Component ─────────────────────────
// Convert a local datetime-local string (e.g. "2026-02-27T10:00") to a full ISO string
// preserving the local timezone offset so the backend stores the correct UTC time.
const localDatetimeToISO = (localStr) => {
    const d = new Date(localStr);
    const tzOffset = -d.getTimezoneOffset(); // minutes
    const sign = tzOffset >= 0 ? "+" : "-";
    const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, "0");
    return d.getFullYear() + "-" +
        pad(d.getMonth() + 1) + "-" +
        pad(d.getDate()) + "T" +
        pad(d.getHours()) + ":" +
        pad(d.getMinutes()) + ":00" +
        sign + pad(tzOffset / 60) + ":" + pad(tzOffset % 60);
};

function EditAppointmentModal({ appointment, onClose, onSave }) {
    const formatForInput = (dateStr) => {
        const d = new Date(dateStr);
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 16);
    };

    const [date, setDate] = useState(formatForInput(appointment.date));
    const [notes, setNotes] = useState(appointment.notes || "");
    const [status, setStatus] = useState(appointment.status);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await onSave(appointment._id, { date: localDatetimeToISO(date), notes, status });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit Appointment</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <p className="modal-subtitle">
                    Patient: <strong>{appointment.patient?.name}</strong>
                </p>
                <form onSubmit={handleSubmit} className="dashboard-form">
                    <div className="form-group">
                        <label>Date &amp; Time</label>
                        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Notes</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Optional notes..." />
                    </div>
                    {error && <div className="message message-error">{error}</div>}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Confirm Delete Modal ──────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-card modal-confirm" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Confirm Delete</h3>
                    <button className="modal-close" onClick={onCancel}>✕</button>
                </div>
                <p className="modal-subtitle">{message}</p>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    <button className="btn-danger" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}

// ── Main Dashboard ────────────────────────────────────────────
function Dashboard() {
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [doctorName, setDoctorName] = useState("");

    // Add Patient form
    const [patientName, setPatientName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientDisease, setPatientDisease] = useState("");
    const [patientMsg, setPatientMsg] = useState({ text: "", error: false });
    const [patientLoading, setPatientLoading] = useState(false);

    // Book Appointment form
    const [selectedPatient, setSelectedPatient] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentNotes, setAppointmentNotes] = useState("");
    const [appointmentMsg, setAppointmentMsg] = useState({ text: "", error: false });
    const [appointmentLoading, setAppointmentLoading] = useState(false);

    // Modals
    const [editPatient, setEditPatient] = useState(null);
    const [editAppointment, setEditAppointment] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null); // { type, id, label }

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        setDoctorName(localStorage.getItem("doctorName") || "Doctor");
        fetchPatients();
        fetchAppointments();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axios.get("/api/patients", authHeader(token));
            setPatients(res.data.patients);
        } catch (err) {
            if (err.response?.status === 401) { localStorage.clear(); navigate("/login"); }
        }
    };

    const fetchAppointments = async () => {
        try {
            const res = await axios.get("/api/appointments", authHeader(token));
            setAppointments(res.data.appointments);
        } catch (err) { console.error(err); }
    };

    // ── Patient Actions ────────────────────────────────────────
    const handleAddPatient = async (e) => {
        e.preventDefault();
        setPatientLoading(true);
        setPatientMsg({ text: "", error: false });
        try {
            await axios.post("/api/patients",
                { name: patientName, age: parseInt(patientAge), disease: patientDisease },
                authHeader(token)
            );
            setPatientMsg({ text: "Patient added successfully!", error: false });
            setPatientName(""); setPatientAge(""); setPatientDisease("");
            fetchPatients();
        } catch (err) {
            setPatientMsg({ text: err.response?.data?.message || "Failed to add patient", error: true });
        } finally { setPatientLoading(false); }
    };

    const handleUpdatePatient = async (id, data) => {
        await axios.put(`/api/patients/${id}`, data, authHeader(token));
        fetchPatients();
        fetchAppointments(); // refresh appointment panel too (patient name may change)
    };

    const handleDeletePatient = async (id) => {
        await axios.delete(`/api/patients/${id}`, authHeader(token));
        fetchPatients();
        fetchAppointments();
        setConfirmDelete(null);
    };

    // ── Appointment Actions ────────────────────────────────────
    const handleBookAppointment = async (e) => {
        e.preventDefault();
        setAppointmentLoading(true);
        setAppointmentMsg({ text: "", error: false });
        try {
            await axios.post("/api/appointments",
                { patientId: selectedPatient, date: localDatetimeToISO(appointmentDate), notes: appointmentNotes },
                authHeader(token)
            );
            setAppointmentMsg({ text: "Appointment booked successfully!", error: false });
            setSelectedPatient(""); setAppointmentDate(""); setAppointmentNotes("");
            fetchAppointments();
        } catch (err) {
            setAppointmentMsg({ text: err.response?.data?.message || "Failed to book", error: true });
        } finally { setAppointmentLoading(false); }
    };

    const handleUpdateAppointment = async (id, data) => {
        await axios.put(`/api/appointments/${id}`, data, authHeader(token));
        fetchAppointments();
    };

    const handleDeleteAppointment = async (id) => {
        await axios.delete(`/api/appointments/${id}`, authHeader(token));
        fetchAppointments();
        setConfirmDelete(null);
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleString("en-IN", {
            year: "numeric", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

    return (
        <div className="dashboard-wrapper">
            <Navbar doctorName={doctorName} />

            <main className="dashboard-main">
                {/* Hero */}
                <div className="dashboard-hero">
                    <h1>Welcome back, Dr. {doctorName}</h1>
                    <p>Manage your patients and appointments from one place.</p>
                </div>

                {/* Stats */}
                <div className="stats-bar">
                    <div className="stat-card">
                        <span className="stat-icon">&#43;</span>
                        <div>
                            <div className="stat-number">{patients.length}</div>
                            <div className="stat-label">Total Patients</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">&#128197;</span>
                        <div>
                            <div className="stat-number">{appointments.length}</div>
                            <div className="stat-label">Appointments</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">&#10003;</span>
                        <div>
                            <div className="stat-number">
                                {appointments.filter((a) => a.status === "scheduled").length}
                            </div>
                            <div className="stat-label">Scheduled</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    {/* ── LEFT: Patients ─────────────────────────────── */}
                    <div className="dashboard-column">
                        {/* Add Patient */}
                        <div className="card">
                            <h2 className="card-title"><span>+</span> Add New Patient</h2>
                            <form onSubmit={handleAddPatient} className="dashboard-form">
                                <div className="form-group">
                                    <label>Patient Name</label>
                                    <input type="text" placeholder="Full name" value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Age</label>
                                    <input type="number" placeholder="Age" value={patientAge}
                                        onChange={(e) => setPatientAge(e.target.value)} min="0" max="150" required />
                                </div>
                                <div className="form-group">
                                    <label>Disease / Condition</label>
                                    <input type="text" placeholder="e.g. Hypertension" value={patientDisease}
                                        onChange={(e) => setPatientDisease(e.target.value)} required />
                                </div>
                                {patientMsg.text && (
                                    <div className={`message ${patientMsg.error ? "message-error" : "message-success"}`}>
                                        {patientMsg.text}
                                    </div>
                                )}
                                <button type="submit" className="btn-primary" disabled={patientLoading}>
                                    {patientLoading ? "Adding..." : "Add Patient"}
                                </button>
                            </form>
                        </div>

                        {/* Patient List */}
                        <div className="card">
                            <h2 className="card-title"><span>&#128100;</span> My Patients</h2>
                            {patients.length === 0 ? (
                                <div className="empty-state"><p>No patients yet. Add your first patient above.</p></div>
                            ) : (
                                <div className="list">
                                    {patients.map((p) => (
                                        <div key={p._id} className="list-item">
                                            <div className="list-item-avatar">{p.name.charAt(0).toUpperCase()}</div>
                                            <div className="list-item-info">
                                                <strong>{p.name}</strong>
                                                <span>Age: {p.age}</span>
                                                <span className="badge">{p.disease}</span>
                                            </div>
                                            <div className="list-item-actions">
                                                <button className="btn-icon btn-edit" title="Edit patient"
                                                    onClick={() => setEditPatient(p)}>Edit</button>
                                                <button className="btn-icon btn-delete" title="Delete patient"
                                                    onClick={() => setConfirmDelete({ type: "patient", id: p._id, label: p.name })}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: Appointments ────────────────────────── */}
                    <div className="dashboard-column">
                        {/* Book Appointment */}
                        <div className="card">
                            <h2 className="card-title"><span>+</span> Book Appointment</h2>
                            <form onSubmit={handleBookAppointment} className="dashboard-form">
                                <div className="form-group">
                                    <label>Select Patient</label>
                                    <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} required>
                                        <option value="">-- Choose a patient --</option>
                                        {patients.map((p) => (
                                            <option key={p._id} value={p._id}>{p.name} ({p.disease})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date &amp; Time</label>
                                    <input type="datetime-local" value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Notes (Optional)</label>
                                    <textarea placeholder="Any notes..." value={appointmentNotes}
                                        onChange={(e) => setAppointmentNotes(e.target.value)} rows={3} />
                                </div>
                                {appointmentMsg.text && (
                                    <div className={`message ${appointmentMsg.error ? "message-error" : "message-success"}`}>
                                        {appointmentMsg.text}
                                    </div>
                                )}
                                <button type="submit" className="btn-primary"
                                    disabled={appointmentLoading || patients.length === 0}>
                                    {appointmentLoading ? "Booking..." : "Book Appointment"}
                                </button>
                                {patients.length === 0 && (
                                    <p className="hint-text">Add a patient first to book an appointment.</p>
                                )}
                            </form>
                        </div>

                        {/* Appointment List */}
                        <div className="card">
                            <h2 className="card-title"><span>&#128197;</span> My Appointments</h2>
                            {appointments.length === 0 ? (
                                <div className="empty-state"><p>No appointments yet. Book your first one above.</p></div>
                            ) : (
                                <div className="list">
                                    {appointments.map((appt) => (
                                        <div key={appt._id} className="list-item list-item-appointment">
                                            <div className="appointment-date-block">
                                                <span className="appointment-icon">&#128336;</span>
                                            </div>
                                            <div className="list-item-info">
                                                <strong>{appt.patient?.name || "Unknown Patient"}</strong>
                                                <span className="appointment-time">{formatDate(appt.date)}</span>
                                                <span className={`badge badge-status badge-${appt.status}`}>{appt.status}</span>
                                            {appt.notes && (
                                                    <span className="appointment-notes">{appt.notes}</span>
                                                )}
                                            </div>
                                            <div className="list-item-actions">
                                                <button className="btn-icon btn-edit" title="Edit appointment"
                                                    onClick={() => setEditAppointment(appt)}>Edit</button>
                                                <button className="btn-icon btn-delete" title="Delete appointment"
                                                    onClick={() => setConfirmDelete({ type: "appointment", id: appt._id, label: `appointment for ${appt.patient?.name}` })}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Modals ───────────────────────────────────────────── */}
            {editPatient && (
                <EditPatientModal
                    patient={editPatient}
                    onClose={() => setEditPatient(null)}
                    onSave={handleUpdatePatient}
                />
            )}

            {editAppointment && (
                <EditAppointmentModal
                    appointment={editAppointment}
                    onClose={() => setEditAppointment(null)}
                    onSave={handleUpdateAppointment}
                />
            )}

            {confirmDelete && (
                <ConfirmModal
                    message={`Are you sure you want to delete the ${confirmDelete.label}? This cannot be undone.`}
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={() =>
                        confirmDelete.type === "patient"
                            ? handleDeletePatient(confirmDelete.id)
                            : handleDeleteAppointment(confirmDelete.id)
                    }
                />
            )}
        </div>
    );
}

export default Dashboard;
