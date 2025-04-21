# # Base image
# FROM node:23-alpine


# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json (or yarn.lock) files
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the entire project
# COPY . .

# # Build the application
# #RUN npm run build

# # Expose port 5173 (default for Vite)
# EXPOSE 3000

# # Start the application
# CMD ["npm", "run", "dev"]


# Stage 1: Build stage
FROM node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy only the built files and dependencies from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]