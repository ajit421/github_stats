const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GitHub Stats API is running!',
    endpoints: [
      '/api/stats?username=YOUR_USERNAME',
      '/api/streak?username=YOUR_USERNAME'
    ]
  });
});

// Basic stats endpoint (example)
app.get('/api/stats', async (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  // SVG response bhejenge
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=14400');
  
  const svg = `
    <svg width="495" height="195" xmlns="http://www.w3.org/2000/svg">
      <rect width="495" height="195" fill="#0d1117" rx="10"/>
      <text x="247" y="100" font-family="Arial" font-size="24" fill="#58a6ff" text-anchor="middle">
        ${username}'s GitHub Stats
      </text>
    </svg>
  `;
  
  res.send(svg);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Vercel ke liye export karo
module.exports = app;