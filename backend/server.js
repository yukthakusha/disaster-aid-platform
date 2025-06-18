const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const db = require('./db/connection');

// Load .env variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Setup OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Log DB config (for verification)
console.log('🔐 ENV Loaded:', {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yuktha',
  database: process.env.DB_NAME || 'disaster_aid',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve HTML files like chat.html

// Routes
const alertsRoutes = require('./routes/alerts');
const requestRoutes = require('./routes/requests');

app.use('/api/alerts', alertsRoutes);
app.use('/api/requests', requestRoutes);

// 🔮 AI Chatbot Route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Normalize user input
  const lowerMessage = message.toLowerCase();

  let reply = "I'm not sure how to help with that. Could you rephrase?";

  // Sample fake replies
  if (lowerMessage.includes("food") && lowerMessage.includes("without gas")) {
    const suggestions = [
      "You can make peanut butter sandwiches, fruit salads, or use canned food.",
      "Try making oats with hot water from an electric kettle or eat ready-to-eat meals.",
      "Energy bars, bread with jam, or soaked poha can work well without cooking gas."
    ];
    reply = suggestions[Math.floor(Math.random() * suggestions.length)];
  } else if (lowerMessage.includes("shelter")) {
    reply = "Please locate your nearest disaster relief center or contact 100 for help.";
  } else if (lowerMessage.includes("emergency")) {
    reply = "In an emergency, call 112 or your local authorities immediately.";
  } else if (lowerMessage.includes("water")) {
    reply = "For safe drinking water, boil it or use water purifying tablets if available.";
  }

  res.json({ reply });
});


// Root endpoint
app.get('/', (req, res) => {
  res.send('🚀 DisasterAid Backend is Running!');
});
console.log('📦 Starting server...');

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Connected to MySQL Database`);
  console.log(`🚀 Server successfully running at: http://localhost:${PORT}`);
});
