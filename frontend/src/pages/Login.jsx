/**
 * PAGES/LOGIN.JSX - Doctor Login Page
 *
 * KEY CONCEPTS:
 * - On successful login, the backend returns a JWT token
 * - We store the token in localStorage (browser storage that persists across refreshes)
 * - After storing the token, we navigate to /dashboard
 * - All future API calls will include this token in the Authorization header
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            // Send login credentials to the backend
            const response = await axios.post("/api/auth/login", { email, password });

            // STORE THE JWT TOKEN IN localStorage
            // localStorage is browser storage that persists even when you close the tab.
            // The token will be used in all future authenticated API requests.
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("doctorName", response.data.doctor.name);

            setIsError(false);
            setMessage("Login successful! Redirecting...");

            // Navigate to the dashboard after a short delay
            setTimeout(() => navigate("/dashboard"), 800);
        } catch (error) {
            setIsError(true);
            setMessage(
                error.response?.data?.message || "Login failed. Check your credentials."
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
                    <h1>Sign In</h1>
                    <p>Clinic Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
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
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <div className={`message ${isError ? "message-error" : "message-success"}`}>
                            {message}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
