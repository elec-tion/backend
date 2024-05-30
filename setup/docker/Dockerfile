# Use the official Node.js 21 image as the base image
FROM node:21

# Create a new directory for logs
RUN mkdir -p /app/api/logs

# Set the working directory in the container
WORKDIR /app

# Copy whole packages directory
COPY . .