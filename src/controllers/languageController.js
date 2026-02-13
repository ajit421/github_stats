const NodeCache = require('node-cache');
const languageService = require('../services/languageService');
const renderLanguageCard = require('../templates/languageCard');
const renderErrorCard = require('../templates/errorCard');

const langCache = new NodeCache({ stdTTL: 7200 }); // 2 hours

const getTopLanguages = async (req, res, next) => {
    try {
        const { username, theme = 'default', layout = 'normal' } = req.query;

        if (!username) {
            return res.status(400).send('Missing username parameters');
        }

        const cacheKey = `lang-${username}-${theme}-${layout}`;
        const cachedCard = langCache.get(cacheKey);

        if (cachedCard) {
            res.setHeader('Content-Type', 'image/svg+xml');
            return res.send(cachedCard);
        }

        const languages = await languageService.fetchTopLanguages(username);
        const svg = renderLanguageCard(languages, { theme, layout });

        langCache.set(cacheKey, svg);

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
    getTopLanguages,
};
