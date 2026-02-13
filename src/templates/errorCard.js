const renderErrorCard = (message, options = {}) => {
    const { theme = 'default' } = options;
    const themes = {
        default: { bg: '#fff', text: '#333', border: '#e4e2e2' },
        dark: { bg: '#151515', text: '#fff', border: '#e4e2e2' },
        tokyonight: { bg: '#1a1b26', text: '#7aa2f7', border: '#1a1b26' },
        radical: { bg: '#141321', text: '#a9fef7', border: '#141321' },
    };

    const t = themes[theme] || themes.default;

    return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .error { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.text}; }
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="${t.bg}" stroke="${t.border}"/>
      <text x="25" y="100" class="error">Error: ${message}</text>
    </svg>
    `;
};

module.exports = renderErrorCard;
