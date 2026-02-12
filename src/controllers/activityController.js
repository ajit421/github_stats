const NodeCache = require('node-cache');
const activityService = require('../services/activityService');
const renderActivityCard = require('../templates/activityCard');

const activityCache = new NodeCache({ stdTTL: 7200 }); // 2 hours

const getCommitActivity = async (req, res, next) => {
    try {
        const { username, theme = 'default' } = req.query;

        if (!username) {
            return res.status(400).send('Missing username parameters');
        }

        const cacheKey = `activity-${username}-${theme}`;
        const cachedCard = activityCache.get(cacheKey);

        if (cachedCard) {
            res.setHeader('Content-Type', 'image/svg+xml');
            return res.send(cachedCard);
        }

        const activity = await activityService.fetchCommitActivity(username);
        const svg = renderActivityCard(activity, { theme });

        activityCache.set(cacheKey, svg);

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
    getCommitActivity,
};
