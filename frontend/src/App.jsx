/**
 * APP.JSX - Main Application Component with Routing
 *
 * This is the "root" of our React component tree.
 *
 * WHAT IS REACT ROUTER?
 * React Router lets us create multi-page experiences in a Single Page App (SPA).
 * Instead of loading a new HTML page, React Router swaps out components
 * based on the URL in the browser's address bar.
 *
 * <Routes> → Container for all routes
 * <Route path="/" element={<Component />}> → Match URL to a component
 *
 * ROUTE PROTECTION:
 * The Dashboard is protected: if no token in localStorage, redirect to /login.
 * This is done inside the Dashboard component itself.
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <Routes>
            {/* Default route: redirect to /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Authentication pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected dashboard page */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Catch-all: redirect unknown URLs to /login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
