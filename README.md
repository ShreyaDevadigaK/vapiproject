# Vapi AI Automated Phone Screening 🚀

A full-stack PERN (PostgreSQL, Express, React, Node.js) application integrated with **Vapi AI**. This project allows users to fill out a contact inquiry form and instantly receive an automated AI phone call acting as an HR Recruiter to perform initial screening or answer questions.

## 🏗️ Architecture Stack
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **AI Voice Integration**: Vapi AI & Twilio
- **Bot Protection**: Google reCAPTCHA

## ⚙️ Features
1. **Dynamic Contact Form**: Users submit their contact info and the service/role they are inquiring about.
2. **Instant AI Outbound Call**: Upon form submission, the backend instantly connects to the Vapi API to trigger an outbound phone call.
3. **Database Logging**: All inquiries are securely stored in a PostgreSQL database for future reference.
4. **Dynamic Context Injection**: The candidate's name, message, and requested service are dynamically passed into the AI's System Prompt on every call.

---

## 🛠️ Local Development Setup

### 1. Database Setup
1. Download and install PostgreSQL (or use pgAdmin).
2. Create a database called `vapiproject`.
3. Open the Query Tool in pgAdmin and create the required table:
```sql
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service VARCHAR(255),
    message TEXT
);
```

### 2. Backend Environment Variables
Create a `.env` file in the `server` directory and add the following:
```env
# Database Credentials
PG_USER=your_postgres_user
PG_HOST=localhost
PG_DATABASE=vapiproject
PG_PASSWORD=your_password
PG_PORT=5432

# Vapi API Integration
# Ensure this is your PRIVATE API key
VAPI_PRIVATE_API_KEY=your-private-key-here
VAPI_PHONE_NUMBER_ID=your-vapi-phone-number-id

# Vapi Assistant ID from the Dashboard
VAPI_ASSISTANT_ID=your-assistant-id
```

### 3. Run the Servers

**Backend:**
```bash
cd server
npm install
npm start
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🚀 Deployment Instructions

### Deploying the Backend (e.g., Render, Railway, Heroku)
1. Add a **New Web Service**.
2. Set the Root Directory to `server`.
3. The platform should automatically detect Node.js and run `npm install` and `npm start`.
4. **Required Environment Variables in Production**:
   - `DATABASE_URL`: Add the connection string provided by your managed PostgreSQL database.
   - `VAPI_PRIVATE_API_KEY`, `VAPI_PHONE_NUMBER_ID`, `VAPI_ASSISTANT_ID`.

### Deploying the Frontend (e.g., Vercel, Netlify)
1. Import the `client` directory into Vercel.
2. Under "Environment Variables", you MUST add:
   - `VITE_API_URL`: Set this to your live backend URL (e.g., `https://your-backend-app.onrender.com`).
3. Deploy!

## ⚠️ Common Troubleshooting
- **"Cannot GET /"**: This is normal if you visit the backend port directly. We added a friendly welcome message route so you can verify the backend is running.
- **Outbound call triggers but phone doesn't ring**: Check your Vapi Dashboard -> Logs. If you do not have an active Twilio phone number, or if international calling is blocked on your free trial, Twilio will reject the call before it rings.
