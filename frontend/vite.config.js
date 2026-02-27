/**
 * VITE.CONFIG.JS - Vite Build Tool Configuration
 *
 * Two important settings:
 *
 * 1) plugins: [@vitejs/plugin-react]
 *    Enables React support (JSX transformation, Fast Refresh)
 *
 * 2) server.proxy - PROXY CONFIGURATION
 *    This is key for development! When our React app calls "/api/..."
 *    in development mode, Vite forwards those requests to our
 *    backend at http://localhost:5000.
 *
 *    WHY PROXY?
 *    Both frontend (port 5173) and backend (port 5000) run on
 *    different ports. Without the proxy, CORS would block the requests.
 *    The proxy makes it look like all requests go to the same server.
 *
 *    Note: In production, you'd configure this on your actual web server.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Any request starting with /api will be forwarded to backend
            "/api": {
                target: "https://clinic-management-backend-7j55.onrender.com", // Our deployed Express backend
                changeOrigin: true, // Needed for virtual hosted sites
                secure: false, // In case of HTTPS redirect issues
            },
        },
    },
});
