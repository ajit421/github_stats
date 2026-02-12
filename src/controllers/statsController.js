const NodeCache = require('node-cache');
const githubService = require('../services/githubService');
const renderStatsCard = require('../templates/statsCard');

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
        if (error.response && error.response.status === 404) {
            return res.status(404).send('User not found');
        }
        next(error);
    }
};

module.exports = {
    getStats,
};
