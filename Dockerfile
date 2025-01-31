# FROM node:18-alpine
FROM oven/bun:1 AS base

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set the default command to run the application
CMD ["bun", "start"]
