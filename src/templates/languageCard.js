const themes = {
    default: { bg: '#fff', text: '#333', border: '#e4e2e2' },
    dark: { bg: '#0d1117', text: '#fff', border: '#e4e2e2' },
    tokyonight: { bg: '#1a1b26', text: '#7aa2f7', border: '#1a1b26' },
    radical: { bg: '#141321', text: '#a9fef7', border: '#141321' },
};

const langColors = {
    JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c', Python: '#3572A5',
    Vue: '#41b883', TypeScript: '#2b7489', Java: '#b07219', Go: '#00ADD8',
    'C#': '#178600', PHP: '#4F5D95', Ruby: '#701516', Swift: '#ffac45',
    Rust: '#dea584', Kotlin: '#A97BFF', C: '#555555', 'C++': '#f34b7d',
    Dart: '#00B4AB', Shell: '#89e051', Dockerfile: '#384d54', SQL: '#e38c00'
};

const renderLanguageCard = (languages = {}, options = {}) => {
    const { theme = 'default', layout = 'normal', custom_title, hide_border = 'false' } = options;
    const t = themes[theme] || themes.default;

    // Calculate total bytes
    const totalBytes = Object.values(languages).reduce((acc, curr) => acc + curr.size, 0);

    let rows = '';
    let pieSegments = '';
    let pieOffset = 0;
    const pieRadius = 60;
    const pieCenter = { x: 380, y: 100 };
    const pieCircumference = 2 * Math.PI * pieRadius;

    // Sort languages by size and take top 5 + others
    const sortedLangs = Object.entries(languages)
        .sort((a, b) => b[1].size - a[1].size)
        .slice(0, 5); // Limit to top 5 for display to fit card

    sortedLangs.forEach(([lang, data], index) => {
        const color = langColors[lang] || data.color || '#cccccc';
        const percentage = totalBytes > 0 ? ((data.size / totalBytes) * 100).toFixed(1) : 0;

        // List generation
        rows += `
            <g transform="translate(25, ${50 + index * 25})">
                <circle cx="5" cy="5" r="5" fill="${color}"/>
                <text x="20" y="9" font-size="12" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="600" fill="${t.text}">${lang}</text>
                <text x="120" y="9" font-size="12" font-family="'Segoe UI', Ubuntu, Sans-Serif" fill="${t.text}" opacity="0.7">${percentage}%</text>
            </g>
        `;

        // Pie chart generation (Donut)
        if (totalBytes > 0) {
            const segmentLength = (data.size / totalBytes) * pieCircumference;
            const dashArray = `${segmentLength} ${pieCircumference}`;
            const rotate = (pieOffset / totalBytes) * 360;

            pieSegments += `
                <circle r="${pieRadius}" cx="${pieCenter.x}" cy="${pieCenter.y}" 
                    fill="none" stroke="${color}" stroke-width="20" 
                    stroke-dasharray="${dashArray}" transform="rotate(${rotate - 90} ${pieCenter.x} ${pieCenter.y})" />
            `;
            pieOffset += data.size;
        }
    });

    const isPie = layout === 'pie' || layout === 'normal';
    const border = hide_border === 'true' ? 'none' : t.border;
    const title = custom_title ? custom_title : 'Top Languages';

    return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="${t.bg}" stroke="${border}" stroke-opacity="${hide_border === 'true' ? '0' : '1'}"/>
    <text x="25" y="30" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="600" font-size="18" fill="${t.text}">${title}</text>
    
    <!-- List -->
    ${rows}

    <!-- Pie/Donut Chart -->
    ${isPie ? pieSegments : ''}
    </svg>
    `;
};

module.exports = renderLanguageCard;