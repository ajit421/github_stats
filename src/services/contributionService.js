const axios = require('axios');
const githubConfig = require('../config/github');

const fetchContributionData = async (username) => {
  // Enable mock data for testing/verification without valid token
  if (process.env.MOCK_DATA === 'true') {
    console.log('Using Mock Data for Streak Stats');
    return {
      totalContributions: 1234,
      currentStreak: 42,
      longestStreak: 100
    };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is missing');

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const response = await axios.post(
    'https://api.github.com/graphql',
    { query, variables: { login: username } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  const data = response.data.data.user.contributionsCollection.contributionCalendar;

  // Flatten weeks to get a sorted array of days
  const days = data.weeks.flatMap(week => week.contributionDays);

  // Basic streak calculation logic
  // Note: This needs robust handling for timezones and "today" vs "yesterday"
  // For simplicity, we assume standard UTC days provided by GitHub API

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Iterate from the end (most recent) to find current streak
  // We check if the last available day has contributions, or if the streak ended yesterday
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Reverse loop for current streak
  let streakActive = true;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (day.contributionCount > 0) {
      if (streakActive) currentStreak++;
    } else {
      // If it's today and 0 contributions, streak might still be active from yesterday
      if (i === days.length - 1 && day.date === today) {
        continue;
      }
      streakActive = false;
    }
  }

  // Forward loop for longest streak
  days.forEach(day => {
    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });

  return {
    totalContributions: data.totalContributions,
    currentStreak,
    longestStreak,
  };
};

module.exports = {
  fetchContributionData,
};
