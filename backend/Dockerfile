# ============================================================
# BACKEND DOCKERFILE
# ============================================================
# Multi-stage is not needed for the backend since we don't
# have a build step — Node.js runs the source files directly.
#
# We use the official "node:18-alpine" base image.
# "alpine" = a tiny Linux distro (~5MB) - keeps the image small.
# ============================================================

# Use Node.js 18 on Alpine Linux (small + secure)
FROM node:18-alpine

# Set the working directory inside the container.
# All subsequent commands run relative to this path.
WORKDIR /app

# Copy package.json and package-lock.json FIRST.
# Docker caches each layer. By copying package files first,
# Docker only re-installs node_modules when these files change
# (not every time your source code changes). This speeds up builds.
COPY package*.json ./

# Install only production dependencies (no nodemon/devDependencies)
# --omit=dev keeps the image small and secure
RUN npm install --omit=dev

# Copy the rest of the backend source code into the container
COPY . .

# Tell Docker this container listens on port 5000
# (This is documentation - actual port mapping is in docker-compose.yml)
EXPOSE 5000

# The command to run when the container starts
# We use "node server.js" instead of "nodemon" for production
CMD ["node", "server.js"]
