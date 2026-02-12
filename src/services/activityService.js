const apiClient = require('../utils/apiClient');

const fetchCommitActivity = async (username) => {
    if (process.env.MOCK_DATA === 'true') {
        // Mock data: 24 hours x 7 days
        // Simplified structure: array of { hour, count } or grouped by day?
        // Requirement: "Commits by hour (0-23), Commits by day of week"
        // Let's return a flat list of timestamps or pre-aggregated data?
        // Pre-aggregated is safer for the template.
        return {
            byHour: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: Math.floor(Math.random() * 20) })),
            byDay: Array.from({ length: 7 }, (_, i) => ({ day: i, count: Math.floor(Math.random() * 50) })),
            totalCommits: 500,
            mostProductiveTime: '14:00'
        };
    }

    try {
        // Fetch recent repos
        const reposResponse = await apiClient.get(`/users/${username}/repos?per_page=20&sort=updated&type=owner`);
        const repos = reposResponse.data;

        // Fetch commits from these repos (limit to avoid rate limits)
        // We'll take the top 5 most active repos and fetch their commits
        const commitPromises = repos.slice(0, 5).map(repo =>
            apiClient.get(`/repos/${repo.owner.login}/${repo.name}/commits?per_page=20`).then(res => res.data).catch(() => [])
        );

        const commitsArrays = await Promise.all(commitPromises);
        const commits = commitsArrays.flat();

        const byHour = Array(24).fill(0);
        const byDay = Array(7).fill(0); // 0=Sunday, 6=Saturday

        commits.forEach(commit => {
            const date = new Date(commit.commit.author.date);
            const hour = date.getHours();
            const day = date.getDay();

            byHour[hour]++;
            byDay[day]++;
        });

        // Format for template
        const hourData = byHour.map((count, i) => ({ hour: i, count }));
        const dayData = byDay.map((count, i) => ({ day: i, count }));

        // Find most productive time (hour block with max commits)
        const maxHour = hourData.reduce((max, current) => current.count > max.count ? current : max, { count: -1 });

        return {
            byHour: hourData,
            byDay: dayData,
            totalCommits: commits.length, // Sample size
            mostProductiveTime: `${maxHour.hour}:00`
        };

    } catch (error) {
        console.error('Error in activity service:', error.message);
        throw error;
    }
};

module.exports = {
    fetchCommitActivity,
};
