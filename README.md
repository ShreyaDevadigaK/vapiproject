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


