const NodeCache = require('node-cache');
const contributionService = require('../services/contributionService');
const renderStreakCard = require('../templates/streakCard');
const renderErrorCard = require('../templates/errorCard');

const streakCache = new NodeCache({ stdTTL: 7200 }); // 2 hours

const getStreak = async (req, res, next) => {
    try {
        const { username, theme = 'default' } = req.query;

        if (!username) {
            return res.status(400).send('Missing username parameters');
        }

        const cacheKey = `streak-${username}-${theme}`;
        const cachedCard = streakCache.get(cacheKey);

        if (cachedCard) {
            res.setHeader('Content-Type', 'image/svg+xml');
            return res.send(cachedCard);
        }

        const streakData = await contributionService.fetchContributionData(username);
        const svg = renderStreakCard(streakData, { theme, username });

        streakCache.set(cacheKey, svg);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=7200'); // 2 hours
        res.send(svg);
    } catch (error) {
        const { theme = 'default' } = req.query;
        let message = 'Something went wrong';

        if (error.response && error.response.status === 404) {
            message = 'User not found';
        } else if (error.message === 'GitHub API Rate Limit Exceeded') {
            message = 'Rate Limit Exceeded';
        } else {
            message = error.message;
        }

        const svg = renderErrorCard(message, { theme });
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        return res.send(svg);
    }
};

module.exports = {
    getStreak,
};
