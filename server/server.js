const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// API endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, service, message, captcha } = req.body;

  if (!captcha) {
    return res.status(400).json({ error: "Captcha not verified." });
  }

  try {
    await pool.query(
      "INSERT INTO contact_messages (name, email, phone, service, message) VALUES ($1, $2, $3, $4, $5)",
      [name, email, phone, service, message]
    );
    res.status(200).json({ message: "Message stored successfully!" });
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
