# ============================================================
# FRONTEND DOCKERFILE - Multi-Stage Build
# ============================================================
#
# WHY MULTI-STAGE?
# Stage 1 (builder): Uses a full Node.js image to compile the
#   React app into static HTML/CSS/JS files (the "dist" folder).
#
# Stage 2 (production): Uses a tiny Nginx image to serve only
#   the compiled static files. The Node.js image is discarded!
#   Final image is ~25MB instead of ~300MB.
#
# FLOW: Source Code → [Node builds] → dist/ → [Nginx serves] → Browser
# ============================================================

# ── STAGE 1: BUILD THE REACT APP ──────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy and install dependencies (cached layer optimization)
COPY package*.json ./
RUN npm install

# Copy all frontend source files
COPY . .

# Run "npm run build" which runs "vite build"
# This produces an optimized static site in the /app/dist folder
RUN npm run build

# ── STAGE 2: SERVE WITH NGINX ─────────────────────────────
# nginx:alpine is only ~25MB - perfect for production serving
FROM nginx:alpine

# Copy our custom Nginx configuration
# This config handles:
#   - Serving the React SPA (single page app routing)
#   - Proxying /api/* requests to the backend container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled "dist" folder from the builder stage into Nginx's
# web root directory. Only the built files are included - no Node.js!
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx serves on port 80 by default
EXPOSE 80

# Start Nginx in the foreground (required for Docker containers)
CMD ["nginx", "-g", "daemon off;"]
