const apiClient = require('../utils/apiClient');

const fetchTopLanguages = async (username) => {
    if (process.env.MOCK_DATA === 'true') {
        return {
            JavaScript: { size: 50000, color: '#f1e05a' },
            HTML: { size: 20000, color: '#e34c26' },
            CSS: { size: 15000, color: '#563d7c' },
            Python: { size: 10000, color: '#3572A5' },
            Vue: { size: 5000, color: '#41b883' }
        };
    }

    // Fetch user's public repos (sort by updated to get most relevant)
    try {
        const reposResponse = await apiClient.get(`/users/${username}/repos?per_page=100&sort=updated&type=owner`);
        const repos = reposResponse.data;

        // Limit to top 20 recently updated repos to avoid hitting rate limits if parallelizing
        const recentRepos = repos.slice(0, 20);

        const languagePromises = recentRepos.map(repo =>
            apiClient.get(repo.languages_url).then(res => res.data).catch(() => ({}))
        );

        const languagesList = await Promise.all(languagePromises);

        const aggregated = {};

        languagesList.forEach(langs => {
            Object.entries(langs).forEach(([lang, bytes]) => {
                if (!aggregated[lang]) {
                    aggregated[lang] = { size: 0, color: null }; // Color fetching would require a map or extra call, will skip color for now or use a hardcoded map in template
                }
                aggregated[lang].size += bytes;
            });
        });

        return aggregated;
    } catch (error) {
        console.error('Error in language service:', error.message);
        throw error;
    }
};

module.exports = {
    fetchTopLanguages,
};
