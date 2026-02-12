const NodeCache = require('node-cache');
const contributionService = require('../services/contributionService');
const renderStreakCard = require('../templates/streakCard');

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
        if (error.response && error.response.status === 404) {
            return res.status(404).send('User not found');
        }
        next(error);
    }
};

module.exports = {
    getStreak,
};
