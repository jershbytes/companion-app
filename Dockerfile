# Stage 1: Build frontend
FROM oven/bun:1.2.18 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lock ./
RUN bun install
COPY frontend ./
RUN bun run build

# Stage 2: Build backend
FROM oven/bun:1.2.18 AS backend
WORKDIR /app
COPY server.js package.json bun.lock ./
COPY internal ./internal
RUN bun install
COPY --from=frontend /app/frontend/dist ./client/dist

# Set permissions for the db directory after copying
RUN mkdir -p /app/internal/db && chmod -R 644 /app/internal/db

EXPOSE 3001
CMD ["bun", "server.js"]