/**
 * server.js — serves frontend and login/register APIs.
 */

const path = require("path");
const express = require("express");
const { initDatabase, pool } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function normalizeEmail(rawEmail) {
  return String(rawEmail || "").trim().toLowerCase();
}

function isValidCredentials(email, password) {
  return email.includes("@") && String(password || "").length >= 6;
}

app.post("/api/register", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const role = req.body?.role === "teacher" ? "teacher" : "student";

  if (!isValidCredentials(email, password)) {
    return res
      .status(400)
      .json({ ok: false, message: "Please enter a valid email and a 6+ character password." });
  }

  try {
    await pool.query("INSERT INTO users (email, role, password) VALUES (?, ?, ?)", [
      email,
      role,
      password,
    ]);
    return res.json({ ok: true, message: "Registration successful." });
  } catch (error) {
    if (error && error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ ok: false, message: "Email already registered." });
    }
    console.error("Register error:", error);
    return res.status(500).json({ ok: false, message: "Server error while creating account." });
  }
});

app.post("/api/login", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const role = req.body?.role === "teacher" ? "teacher" : "student";

  if (!isValidCredentials(email, password)) {
    return res.status(400).json({ ok: false, message: "Invalid email or password." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE email = ? AND role = ? AND password = ? LIMIT 1",
      [
      email,
      role,
      password,
      ]
    );
    if (!rows.length) {
      return res.status(401).json({ ok: false, message: "Invalid email or password." });
    }
    return res.json({ ok: true, message: "Login successful." });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ ok: false, message: "Server error while logging in." });
  }
});

// Fallback route: if someone visits unknown URLs, still show the login page.
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`TECH-METH server running → http://localhost:${PORT}`);
      console.log("Login/register API is ready.");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
