const axios = require('axios');
const githubConfig = require('../config/github');

const apiClient = axios.create({
    baseURL: githubConfig.baseUrl,
    timeout: githubConfig.timeout,
    headers: githubConfig.headers,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = process.env.GITHUB_TOKEN;
        if (token) {
            // Handle both 'Bearer' and standard token formats if needed, 
            // but GitHub usually accepts just 'Bearer <token>' or 'token <token>'
            // Standardizing on Bearer for this implementation
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for rate limiting and error handling
apiClient.interceptors.response.use(
    (response) => {
        // Basic rate limit logging (can be expanded)
        const remaining = response.headers['x-ratelimit-remaining'];
        if (remaining !== undefined && parseInt(remaining) < 10) {
            console.warn(`GitHub API Rate Limit Warning: ${remaining} requests remaining.`);
        }
        return response;
    },
    (error) => {
        // Enhance error object with helpful info if available
        if (error.response && error.response.status === 403) {
            const remaining = error.response.headers['x-ratelimit-remaining'];
            if (remaining === '0') {
                error.message = 'GitHub API Rate Limit Exceeded';
            }
        }
        return Promise.reject(error);
    }
);

module.exports = apiClient;
