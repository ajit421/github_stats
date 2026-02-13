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
    const { theme = 'default', layout = 'normal' } = options;
    const t = themes[theme] || themes.default;

    const sortedLangs = Object.entries(languages)
        .sort(([, a], [, b]) => b.size - a.size)
        .slice(0, 5);

    const totalBytes = sortedLangs.reduce((acc, [, data]) => acc + data.size, 0);

    let rows = '';
    let pieOffset = 0;
    const pieRadius = 40; // Increased radius
    const pieCenter = { x: 350, y: 100 };
    const pieCircumference = 2 * Math.PI * pieRadius;

    let pieSegments = '';

    sortedLangs.forEach(([lang, data], index) => {
        const percent = (data.size / totalBytes) * 100;
        const color = langColors[lang] || '#cccccc';

        // List Item
        const y = 60 + (index * 25);
        rows += `
            <g transform="translate(40, ${y})">
                <circle cx="5" cy="5" r="5" fill="${color}"/>
                <text x="20" y="9" font-size="13" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="600" fill="${t.text}">${lang}</text>
                <text x="140" y="9" font-size="12" font-family="'Segoe UI', Ubuntu, Sans-Serif" fill="${t.text}" opacity="0.7">${percent.toFixed(1)}%</text>
            </g>
        `;

        if (layout === 'pie' || layout === 'normal') {
            const segmentLength = (data.size / totalBytes) * pieCircumference;
            const dashArray = `${segmentLength} ${pieCircumference}`;
            const rotate = (pieOffset / totalBytes) * 360;

            // Using stroke-width = 80 and r = 40 to make a solid pie chart (2*r = stroke-width)
            // Or stroke-width = 40 for a nice thick donut. Let's go with Donut for modern look.
            pieSegments += `
                <circle r="${pieRadius}" cx="${pieCenter.x}" cy="${pieCenter.y}" 
                    fill="none" stroke="${color}" stroke-width="40" 
                    stroke-dasharray="${dashArray}" transform="rotate(${rotate - 90} ${pieCenter.x} ${pieCenter.y})" />
            `;
            pieOffset += data.size;
        }
    });

    const isPie = layout === 'pie' || layout === 'normal';

    return `
      <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="${t.bg}" stroke="${t.border}"/>
        <text x="25" y="35" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="600" font-size="18" fill="${t.text}">Top Languages</text>
        
        <!-- List -->
        ${rows}

        <!-- Pie/Donut Chart -->
        ${isPie ? pieSegments : ''}
      </svg>
    `;
};

module.exports = renderLanguageCard;