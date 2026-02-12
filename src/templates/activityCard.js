const themes = {
    default: { bg: '#fff', text: '#333', bar: '#4c71f2', border: '#e4e2e2' },
    dark: { bg: '#0d1117', text: '#fff', bar: '#2f81f7', border: '#e4e2e2' },
    tokyonight: { bg: '#1a1b26', text: '#7aa2f7', bar: '#70a5fd', border: '#1a1b26' },
    radical: { bg: '#141321', text: '#a9fef7', bar: '#fe428e', border: '#141321' },
};

const renderActivityCard = (activity = {}, options = {}) => {
    const { theme = 'default' } = options;
    const t = themes[theme] || themes.default;
    const { byHour, mostProductiveTime } = activity;

    // Dimensions
    const width = 495;
    const height = 195;
    const padding = 25;
    const chartWidth = width - (padding * 2);
    const chartHeight = 100;
    const barWidth = (chartWidth / 24) - 2;

    const maxCount = Math.max(...byHour.map(d => d.count)) || 1;

    let bars = '';
    byHour.forEach((d, i) => {
        const barHeight = (d.count / maxCount) * chartHeight;
        const x = padding + (i * (chartWidth / 24));
        const y = height - padding - barHeight - 20; // -20 for labels

        if (barHeight > 0) {
            bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${t.bar}" rx="2" />`;
        }
    });

    // Hour labels (every 4 hours)
    let labels = '';
    for (let i = 0; i <= 24; i += 4) {
        const x = padding + (i * (chartWidth / 24));
        // Slight adjustment for text alignment
        const textX = i === 24 ? x - 10 : x;
        labels += `<text x="${textX}" y="${height - padding}" font-size="10" fill="${t.text}" opacity="0.6">${i}</text>`;
    }

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="4.5" fill="${t.bg}" stroke="${t.border}"/>
        
        <text x="${padding}" y="30" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="600" font-size="18" fill="${t.text}">Commit Activity</text>
        <text x="${width - padding}" y="30" text-anchor="end" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="12" fill="${t.text}" opacity="0.8">Peaking at ${mostProductiveTime}</text>

        <!-- Chart -->
        ${bars}
        
        <!-- Labels -->
        ${labels}
      </svg>
    `;
};

module.exports = renderActivityCard;
