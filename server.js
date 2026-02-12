require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(cors());
app.use(express.json());

// Startup Checks
if (!process.env.GITHUB_TOKEN) {
    console.warn('WARNING: GITHUB_TOKEN is not set in .env file. API calls to GitHub may fail or be severely rate-limited.');
} else {
    console.log('GitHub Token found.');
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Stats Endpoint
const statsController = require('./src/controllers/statsController');
app.get('/api/stats', statsController.getStats);

// Streak Endpoint
const streakController = require('./src/controllers/streakController');
app.get('/api/streak', streakController.getStreak);

// Language Stats Endpoint
const languageController = require('./src/controllers/languageController');
app.get('/api/top-langs', languageController.getTopLanguages);

// Commit Activity Endpoint
const activityController = require('./src/controllers/activityController');
app.get('/api/commit-activity', activityController.getCommitActivity);

// Error Handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
