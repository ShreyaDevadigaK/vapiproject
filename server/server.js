const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
// Hosting platforms usually provide a single DATABASE_URL connection string.
// We fall back to individual credentials for local development.
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Required by most managed DBs (Render, Heroku, etc.)
      }
    : {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
      }
);

// Root endpoint to display a friendly message in the browser
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
        <h2>🚀 Vapi Integration Server is Running Perfectly!</h2>
        <p>The backend is active and ready to handle contact form requests.</p>
      </body>
    </html>
  `);
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

    // Minimal phone number formatting to E.164 (adds '+' if missing, assumes country code is included)
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    // Trigger Vapi async without blocking the client response
    try {
      if (process.env.VAPI_PRIVATE_API_KEY && process.env.VAPI_PHONE_NUMBER_ID) {
        
        let assistantConfig;
        
        // If an Assistant ID is provided in .env, use it.
        // Otherwise use a dynamic assistant based on the form data.
        if (process.env.VAPI_ASSISTANT_ID) {
          assistantConfig = process.env.VAPI_ASSISTANT_ID;
        } else {
          assistantConfig = {
            firstMessage: `Hello ${name}, I am calling regarding your recent inquiry about ${service}. How can I assist you today?`,
            model: {
              provider: "openai",
              model: "gpt-3.5-turbo",
              messages: [{
                role: "system",
                content: `You are an AI assistant. You are calling a user named ${name} who just submitted a contact form inquiring about ${service}. Answer their questions and gather more details. Their original message was: ${message}`
              }]
            },
            voice: {
              provider: "11labs",
              voiceId: "bIHbv24MWmeRgasZH58o" // Generic voice ID
            }
          };
        }

        const vapiPayload = {
          phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
          customer: {
            number: formattedPhone,
            name: name
          }
        };

        if (typeof assistantConfig === 'string') {
          vapiPayload.assistantId = assistantConfig;
          // Send form data as variables to the Vapi Assistant
          vapiPayload.assistantOverrides = {
            variableValues: {
              name: name,
              service: service,
              message: message
            }
          };
        } else {
          vapiPayload.assistant = assistantConfig;
        }

        fetch("https://api.vapi.ai/call", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.VAPI_PRIVATE_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(vapiPayload)
        })
        .then(response => response.json())
        .then(data => console.log("Outbound call triggered successfully:", data))
        .catch(error => console.error("Failed to trigger outbound call via Vapi API:", error));

      } else {
         console.warn("VAPI API credentials (VAPI_PRIVATE_API_KEY, VAPI_PHONE_NUMBER_ID) not configured. Call trigger skipped.");
      }
    } catch (vapiErr) {
      console.error("Failed to initiate Vapi call due to an internal error:", vapiErr);
    }

    res.status(200).json({ message: "Message stored successfully!" });
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
