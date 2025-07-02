# Companion App

A fullstack application built with Bun (backend) and Vite + React (frontend). Features include:
- User authentication (via environment variable or file)
- Questionnaire submission and results
- Admin dashboard
- Gotify notifications on new submissions
- Timezone-aware date formatting
- Docker and Docker Compose support

## Features
- **Frontend:** React (Vite) SPA served by the backend
- **Backend:** Bun server with SQLite database
- **Auth:** Dynamic users via `USERS_ENV` or `internal/auth/users.json`
- **Notifications:** Sends to Gotify via `GOTIFY_URL` and `GOTIFY_TOKEN`
- **Timezone:** Set with `TIMEZONE` env var (default: America/New_York)

## Quick Start (Docker Compose)

1. **Clone the repo and cd into it:**
   ```sh
   git clone <your-repo-url>
   cd companion-app
   ```

2. **Edit your `.env` file:**
   ```env
   GOTIFY_URL=https://gotify.yourdomain.com
   GOTIFY_TOKEN=your_gotify_token
   USERS_ENV=[{"username":"admin","password":"changeme"}]
   TIMEZONE=America/Detroit
   ```

3. **Build and run with Docker Compose:**
   ```sh
   docker compose build --no-cache
   docker compose up
   ```

4. **Access the app:**
   - Frontend & API: [http://localhost:3001](http://localhost:3001)
   - Admin dashboard: `/admin` (login with a user from `USERS_ENV`)

## Development (Local)

- Run both frontend and backend with hot reload:
  ```sh
  bun run start
  ```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001](http://localhost:3001)

## File Structure
- `frontend/` - React app (Vite)
- `server.js` - Bun backend
- `internal/db/` - SQLite database
- `internal/auth/users.json` - (optional) fallback user list
- `.env` - Environment variables
- `docker-compose.yml` - Docker Compose config
- `Dockerfile` - Multi-stage build for production

## Environment Variables
- `GOTIFY_URL` - Gotify server URL
- `GOTIFY_TOKEN` - Gotify app token
- `USERS_ENV` - JSON array of users (overrides users.json)
- `TIMEZONE` - IANA timezone string (e.g., America/Detroit)

## Notes
- For production, only the backend serves both API and frontend static files.
- For development, use the concurrently script for hot reload.
- To add users, update `USERS_ENV` in `.env` and restart the container.

---

**Enjoy your companion app!**
