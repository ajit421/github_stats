require('dotenv').config();

const config = {
  baseUrl: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'github-stats-api',
  },
  timeout: 10000,
};

module.exports = config;
