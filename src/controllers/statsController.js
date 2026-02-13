const NodeCache = require('node-cache');
const githubService = require('../services/githubService');
const renderStatsCard = require('../templates/statsCard');
const renderErrorCard = require('../templates/errorCard');

const statsCache = new NodeCache({ stdTTL: 14400 }); // 4 hours

const getStats = async (req, res, next) => {
    try {
        const {
            username,
            theme = 'default',
            hide_border = 'false',
            hide_rank = 'false',
            show_icons = 'true',
            custom_title,
            bg_color,
            text_color,
            title_color,
            icon_color,
            border_color
        } = req.query;

        if (!username) {
            return res.status(400).send('Missing username parameters');
        }

        const params = {
            theme,
            hide_border,
            hide_rank,
            show_icons,
            custom_title,
            bg_color,
            text_color,
            title_color,
            icon_color,
            border_color
        };

        const cacheKey = `stats-${username}-${JSON.stringify(params)}`;
        const cachedStats = statsCache.get(cacheKey);

        if (cachedStats) {
            res.setHeader('Content-Type', 'image/svg+xml');
            return res.send(cachedStats);
        }

        const stats = await githubService.getStats(username);
        const svg = renderStatsCard(stats, params);

        statsCache.set(cacheKey, svg);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=14400'); // 4 hours
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
    getStats,
};
