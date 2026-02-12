const themes = {
    default: { bg: '#fff', text: '#333', border: '#e4e2e2' },
    dark: { bg: '#0d1117', text: '#fff', border: '#e4e2e2' },
    tokyonight: { bg: '#1a1b26', text: '#7aa2f7', border: '#1a1b26' },
    radical: { bg: '#141321', text: '#a9fef7', border: '#141321' },
};

// Simple color map for common languages
const langColors = {
    JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c', Python: '#3572A5',
    Vue: '#41b883', TypeScript: '#2b7489', Java: '#b07219', Go: '#00ADD8',
    'C#': '#178600', PHP: '#4F5D95', Ruby: '#701516', Swift: '#ffac45',
    Rust: '#dea584', Kotlin: '#A97BFF', C: '#555555', 'C++': '#f34b7d'
};

const renderLanguageCard = (languages = {}, options = {}) => {
    const { theme = 'default', layout = 'normal' } = options;
    const t = themes[theme] || themes.default;

    // Sort languages by size
    const sortedLangs = Object.entries(languages)
        .sort(([, a], [, b]) => b.size - a.size)
        .slice(0, 5); // Top 5

    const totalBytes = Object.values(languages).reduce((acc, val) => acc + val.size, 0);

    // Calculate layout specifics
    const width = 300;
    const height = layout === 'compact' ? 160 : 300;
    // Wait, the user requirement said "compact | normal" but didn't specify dimensions. 
    // Usually these cards match the others. Let's aim for 300-350 width to fit nice? 
    // Or standard 495x195 if possible? 
    // A pie chart needs height. Let's stick to 300x150 for compact list, 
    // or standard 495x195 for consistency. 
    // Let's go with 300 width for a smaller card, or 495x195 to match others.
    // Let's match standard card size: 495x195.

    // Calculate percentages and start drawing
    let rows = '';
    let pieOffset = 0;
    const pieRadius = 60;
    const pieCenter = { x: 380, y: 100 };
    const pieCircumference = 2 * Math.PI * pieRadius;

    let pieSegments = '';

    sortedLangs.forEach(([lang, data], index) => {
        const percent = (data.size / totalBytes) * 100;
        const color = langColors[lang] || '#cccccc';

        // List Item
        const y = 50 + (index * 25);
        rows += `
            <g transform="translate(25, ${y})">
                <circle cx="5" cy="5" r="5" fill="${color}"/>
                <text x="20" y="9" font-size="12" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="600" fill="${t.text}">${lang}</text>
                <text x="120" y="9" font-size="12" font-family="'Segoe UI', Ubuntu, Sans-Serif" fill="${t.text}" opacity="0.7">${percent.toFixed(1)}%</text>
            </g>
        `;

        // Pie Segment (using stroke-dasharray assumption for simple donut)
        // Note: Full SVG pie chart requires usage of paths with arc commands.
        // For simplicity and robustness without excess code, let's use the stroke-dasharray trick on circles if possible, or paths.
        // Paths are safer for variable segments.

        // Let's implement simple Donut using stroke-dasharray on multiple circles on top of each other?
        // Actually, stroke-dasharray `dash array` where dash is length of arc and gap is rest.
        // We need to rotate each circle.

        if (layout !== 'compact') {
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

    return `
      <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="${t.bg}" stroke="${t.border}"/>
        <text x="25" y="30" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="600" font-size="18" fill="${t.text}">Top Languages</text>
        
        <!-- List -->
        ${rows}

        <!-- Donut Chart -->
        ${layout !== 'compact' ? pieSegments : ''}
      </svg>
    `;
};

module.exports = renderLanguageCard;
