# 🏗️ Build Stage (Includes dependencies & compilation)
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the application
COPY . .

# 🎯 Production Stage (Smaller, optimized final image)
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/src /app/src
COPY --from=builder /app/package.json /app/package.json

# Create a non-root user for security
RUN useradd -m appuser
USER appuser

# Expose the required port
EXPOSE 8080

# Start the application
CMD ["node", "src/index.js"]
