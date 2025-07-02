import { serve } from "bun";
import Database from "bun:sqlite";
import { existsSync, readFileSync } from "fs";
import { extname, join } from "path";

// Use the project root for the DB file.
const dbPath = join(import.meta.dir, "internal", "db", "submissions.db");
const db = new Database(dbPath);

db.run(`CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL,
  submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Gotify notification function
async function sendGotifyNotification(submission) {
  const gotifyUrl = process.env.GOTIFY_URL || import.meta.env.GOTIFY_URL;
  const gotifyToken = process.env.GOTIFY_TOKEN || import.meta.env.GOTIFY_TOKEN;
  if (!gotifyUrl || !gotifyToken) return;
  const payload = {
    title: "New Submission",
    message: `New submission from ${submission.fullname || "unknown"} (${submission.email || "no email"})`,
    priority: 5
  };
  try {
    await fetch(`${gotifyUrl}/message?token=${gotifyToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error("Failed to send Gotify notification:", e);
  }
}

const staticDir = join(import.meta.dir, "client", "dist");
const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
};

// Add this helper at the top or near imports
function formatSubmittedAt(dateString) {
  if (!dateString) return "";
  const tz = process.env.TIMEZONE || "America/New_York";
  try {
    // Use Intl.DateTimeFormat for timezone formatting
    const date = new Date(dateString + "Z"); // ensure UTC
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date).replace(/\//g, '-').replace(',', '');
  } catch {
    // fallback to previous logic if Intl fails
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    return `${mm}-${dd}-${yyyy} ${hours}:${minutes} ${ampm}`;
  }
}

serve({
  port: 3001,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);

    // CORS headers for dev (adjust as needed)
    if (req.method === "OPTIONS") {
      return new Response("", {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Save a new submission
    if (req.method === "POST" && url.pathname === "/api/submit") {
      try {
        const body = await req.json();
        db.run("INSERT INTO submissions (data) VALUES (?)", JSON.stringify(body));
        sendGotifyNotification(body); // Send notification
        return new Response(JSON.stringify({ ok: true }), {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
      }
    }

    // Get a single submission by ID
    if (req.method === "GET" && url.pathname.startsWith("/api/results/")) {
      // Extract ID from the path
      const id = url.pathname.replace("/api/results/", "");
      if (!id) {
        return new Response("Not found", { status: 404 });
      }
      const row = db.query("SELECT * FROM submissions WHERE id = ?").get(id);
      if (!row) {
        return new Response("Not found", { status: 404 });
      }
      const result = { ...JSON.parse(row.data), submittedAt: formatSubmittedAt(row.submittedAt), id: row.id };
      return new Response(JSON.stringify(result), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // Get all submissions (admin)
    if (req.method === "GET" && url.pathname === "/api/results") {
      const rows = db.query("SELECT * FROM submissions ORDER BY submittedAt DESC").all();
      const results = rows.map(row => ({
        ...JSON.parse(row.data),
        submittedAt: formatSubmittedAt(row.submittedAt),
        id: row.id,
      }));
      return new Response(JSON.stringify(results), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // Login endpoint
    if (req.method === "POST" && url.pathname === "/api/login") {
      try {
        const { username, password } = await req.json();
        let users;
        if (process.env.USERS_ENV) {
          try {
            users = JSON.parse(process.env.USERS_ENV);
          } catch (e) {
            return new Response(JSON.stringify({ ok: false, error: "Invalid USERS_ENV format" }), {
              status: 500,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            });
          }
        } else {
          users = JSON.parse(readFileSync(join(import.meta.dir, "internal", "auth", "users.json"), "utf8"));
        }
        const found = users.find(u => u.username === username && u.password === password);
        if (found) {
          return new Response(JSON.stringify({ ok: true, username }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }
        return new Response(JSON.stringify({ ok: false, error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // Delete a submission by ID
    if (req.method === "DELETE" && url.pathname.startsWith("/api/results/")) {
      const id = url.pathname.replace("/api/results/", "");
      if (!id) {
        return new Response("Not found", { status: 404 });
      }
      db.run("DELETE FROM submissions WHERE id = ?", id);
      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // Serve static files from client/dist
    if (req.method === "GET" && !url.pathname.startsWith("/api/")) {
      let filePath = join(staticDir, url.pathname === "/" ? "/index.html" : url.pathname);
      if (!existsSync(filePath)) {
        filePath = join(staticDir, "index.html"); // fallback for SPA
      }
      if (existsSync(filePath)) {
        const ext = extname(filePath);
        const mime = mimeTypes[ext] || "application/octet-stream";
        const content = readFileSync(filePath);
        return new Response(content, {
          headers: { "Content-Type": mime, "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // 404 for everything else
    return new Response("Not found", { status: 404 });
  }
});