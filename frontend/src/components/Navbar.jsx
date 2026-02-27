/**
 * COMPONENTS/NAVBAR.JSX - Navigation Bar Component
 *
 * A reusable component displayed at the top of the dashboard.
 * It shows the app name and a logout button.
 *
 * WHAT HAPPENS ON LOGOUT?
 * - We clear the JWT token from localStorage
 * - We redirect the doctor to the login page
 * - Without the token, they can no longer access the dashboard
 *
 * Props received from Dashboard:
 *   - doctorName: The logged-in doctor's name to display
 */

import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ doctorName }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the JWT token and doctor info from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("doctorName");

        // Redirect to login page
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-logo">+</span>
                <span className="navbar-title">ClinicMS</span>
            </div>

            <div className="navbar-right">
                <div className="navbar-user">
                    <div className="navbar-avatar">
                        {doctorName ? doctorName.charAt(0).toUpperCase() : "D"}
                    </div>
                    <span className="navbar-name">Dr. {doctorName}</span>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
