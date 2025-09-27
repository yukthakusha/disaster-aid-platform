const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./db/connection');
dotenv.config();

const alertsRoutes = require('./routes/alerts');
const requestRoutes = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '../')));

// API Routes
app.use('/api/alerts', alertsRoutes);
app.use('/api/requests', requestRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('DisasterAid Backend Running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
