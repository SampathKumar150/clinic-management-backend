/**
 * MAIN.JSX - React App Entry Point
 *
 * This is where React "mounts" onto the HTML page.
 * It finds the <div id="root"> in index.html and renders our App inside it.
 *
 * BrowserRouter wraps our entire app to enable client-side routing
 * (navigating between pages without full page reloads).
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Find the #root div in index.html and make it a React root
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* BrowserRouter enables the <Route> and <Link> components throughout the app */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
