const apiClient = require('../utils/apiClient');

const fetchUser = async (username) => {
    const response = await apiClient.get(`/users/${username}`);
    return response.data;
};

const fetchRepos = async (username) => {
    const response = await apiClient.get(`/users/${username}/repos?per_page=100&type=owner`);
    return response.data;
};

const fetchTotalCommits = async (username) => {
    try {
        const response = await apiClient.get(`/search/commits?q=author:${username}`, {
            headers: {
                'Accept': 'application/vnd.github.cloak-preview',
            },
        });
        return response.data.total_count;
    } catch (error) {
        console.error(`Error fetching total commits for ${username}:`, error.message);
        return 0; // Fallback if search fails or is rate-limited
    }
};

const calculateRank = ({ totalStars, totalCommits, totalPRs, totalIssues, followers }) => {
    const score = (totalStars * 2) + totalCommits + (totalPRs * 3) + (totalIssues * 1) + (followers * 1);

    if (score > 2000) return 'S';
    if (score > 1000) return 'A+';
    if (score > 500) return 'A';
    if (score > 200) return 'B+';
    if (score > 100) return 'B';
    return 'C';
};

const getStats = async (username) => {
    const [user, repos, totalCommits] = await Promise.all([
        fetchUser(username),
        fetchRepos(username),
        fetchTotalCommits(username),
    ]);

    let totalStars = 0;
    repos.forEach(repo => {
        totalStars += repo.stargazers_count;
    });

    // Note: These are approximations based on public data available via search or other endpoints.
    // A true count of PRs and Issues across all repos is expensive to calculate.
    // For this phase, we might interpret "Total PRs" and "Total Issues" as currently open or closed ones?
    // The user requirement said "Calculate... Total PRs, Total Issues".
    // The Search API is the best way for global counts (like commits).

    // Let's refine PRs/Issues fetch if possible, or use a simplified approach if search is too heavy.
    // Re-using Search API for PRs and Issues will likely hit rate limits (30 req/min).
    // Given constraints, I will stick to what I can get or use a simplified search if possible.
    // For now, let's try to get them via search as well, but handle errors gracefully.

    // Update: To avoid hitting rate limits immediately with 3 search calls per request, 
    // I will skip separate searches for PRs/Issues for now and set them to a placeholder or simplified count if possible, 
    // but to meet the requirement "Calculate... Total PRs, Total Issues", I should try.

    // Let's try fetching PRs/Issues count via search in parallel.
    const fetchCount = async (type) => {
        try {
            const res = await apiClient.get(`/search/issues?q=author:${username}+type:${type}`);
            return res.data.total_count;
        } catch (e) { return 0; }
    };

    const [totalPRs, totalIssues] = await Promise.all([
        fetchCount('pr'),
        fetchCount('issue')
    ]);

    const rank = calculateRank({
        totalStars,
        totalCommits,
        totalPRs,
        totalIssues,
        followers: user.followers
    });

    return {
        name: user.name || user.login,
        totalStars,
        totalCommits,
        totalPRs,
        totalIssues,
        rank,
    };
};

module.exports = {
    getStats,
};
