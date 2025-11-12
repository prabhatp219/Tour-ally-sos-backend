const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");
require("dotenv").config(); 

const app = express();

// Allow requests from your React frontend
app.use(cors()); // Allow all origins for testing
app.use(bodyParser.json());

// Twilio credentials
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

const client = twilio(accountSid, authToken);

// GET route for testing server
app.get("/", (req, res) => {
  res.send("Server is running! POST /send-sms to send a message.");
});

// POST route to send SMS via Twilio
app.post("/send-sms", (req, res) => {
  console.log("Request body:", req.body);
  const { to, message } = req.body;

  if (!to || !message) {
    return res
      .status(400)
      .json({ success: false, error: "Missing 'to' or 'message' in request body." });
  }

  client.messages
    .create({ body: message, from: twilioNumber, to })
    .then(msg => res.json({ success: true, sid: msg.sid }))
    .catch(err => res.status(500).json({ success: false, error: err.message }));
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
