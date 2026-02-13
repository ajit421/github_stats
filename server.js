const express = require('express');
const cors = require('cors');
require('dotenv').config();

const statsController = require('./src/controllers/statsController');
const languageController = require('./src/controllers/languageController');
const streakController = require('./src/controllers/streakController');
const activityController = require('./src/controllers/activityController');

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
      '/api/top-langs?username=YOUR_USERNAME',
      '/api/streak?username=YOUR_USERNAME',
      '/api/commit-activity?username=YOUR_USERNAME'
    ]
  });
});

// Routes
app.get('/api/stats', statsController.getStats);
app.get('/api/top-langs', languageController.getTopLanguages);
app.get('/api/streak', streakController.getStreak);
app.get('/api/commit-activity', activityController.getCommitActivity);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Vercel export
module.exports = app;