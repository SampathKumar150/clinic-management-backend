/**
 * PAGES/REGISTER.JSX - Doctor Registration Page
 *
 * This page allows a new doctor to create an account.
 *
 * KEY CONCEPTS:
 * - useState: React hook to store form data and UI state
 * - axios.post: Sends form data to the backend API
 * - On success, we redirect to /login
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
    // useState manages form input values
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // For user feedback (success or error messages)
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // useNavigate lets us programmatically navigate to another page
    const navigate = useNavigate();

    // handleSubmit is called when the form is submitted
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form reload behavior

        setIsLoading(true);
        setMessage("");

        try {
            // POST to our backend register endpoint
            // Vite's proxy will forward /api/auth/register to http://localhost:5000/api/auth/register
            const response = await axios.post("/api/auth/register", {
                name,
                email,
                password,
            });

            setIsError(false);
            setMessage("Registration successful! Redirecting to login...");

            // Wait 1.5 seconds then redirect to login page
            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            setIsError(true);
            // error.response.data.message comes from our backend error responses
            setMessage(
                error.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">+</div>
                    <h1>Create Account</h1>
                    <p>Join the Clinic Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Dr. John Smith"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="doctor@clinic.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {/* Show success or error message */}
                    {message && (
                        <div className={`message ${isError ? "message-error" : "message-success"}`}>
                            {message}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
