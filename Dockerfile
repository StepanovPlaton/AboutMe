# Stage 1: Build
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build arguments
ARG OAUTH_GITHUB_CLIENT_ID
ARG OAUTH_GITHUB_CLIENT_SECRET

# Set environment variables from build args
ENV OAUTH_GITHUB_CLIENT_ID=${OAUTH_GITHUB_CLIENT_ID}
ENV OAUTH_GITHUB_CLIENT_SECRET=${OAUTH_GITHUB_CLIENT_SECRET}

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine AS production

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8091 (for rootless podman)
EXPOSE 8091

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
