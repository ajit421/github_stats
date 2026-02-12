const themes = {
    default: { bg: '#fff', text: '#333', ring: '#2f81f7', fire: '#e05344', border: '#e4e2e2', currStreak: '#0969da' },
    dark: { bg: '#0d1117', text: '#fff', ring: '#2f81f7', fire: '#e05344', border: '#e4e2e2', currStreak: '#2f81f7' },
    tokyonight: { bg: '#1a1b26', text: '#7aa2f7', ring: '#70a5fd', fire: '#ff9e64', border: '#1a1b26', currStreak: '#70a5fd' },
    radical: { bg: '#141321', text: '#a9fef7', ring: '#fe428e', fire: '#fe428e', border: '#141321', currStreak: '#fe428e' },
};

const renderStreakCard = (streakData = {}, options = {}) => {
    const { totalContributions = 0, currentStreak = 0, longestStreak = 0 } = streakData;
    const { theme = 'default', username = 'User' } = options;

    const t = themes[theme] || themes.default;

    // Animation for ring
    const circumference = 2 * Math.PI * 40;
    // Calculate progress based on a goal (e.g. 100 days for ring visualization, or just purely decorative animation)
    // Let's make it decorative: partial circle based on current vs longest?
    // If longest > 0, percent = current / longest. Else 0.
    const percentage = longestStreak > 0 ? (currentStreak / longestStreak) : 0;
    const offset = circumference - (percentage * circumference);

    return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .stat-label { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.text}; }
        .stat-value { font: 800 24px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.text}; }
        .curr-streak-value { font: 800 32px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.currStreak}; }
        .curr-streak-label { font: 700 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.fire}; text-transform: uppercase; }
        
        @keyframes ring {
          from { stroke-dashoffset: ${circumference}; }
          to { stroke-dashoffset: ${offset}; }
        }
        
        .ring-circle {
          stroke-dasharray: ${circumference};
          stroke-dashoffset: ${circumference};
          animation: ring 1s ease-out forwards;
        }
        
        @keyframes fire {
          0% { opacity: 1; }
          50% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        .fire-icon { animation: fire 2s infinite ease-in-out; }
      </style>
      
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="${t.bg}" stroke="${t.border}"/>

      <!-- Header (Optional or just stats) -->

      <!-- Left: Total Contributions -->
      <g transform="translate(50, 80)">
        <text x="0" y="0" class="stat-label">Total Contributions</text>
        <text x="0" y="30" class="stat-value">${totalContributions}</text>
        <text x="0" y="50" font-size="10" fill="${t.text}" opacity="0.7">This Year</text>
      </g>

      <!-- Center: Current Streak Ring -->
      <g transform="translate(247, 97)">
        <circle r="60" stroke="${t.border}" stroke-width="8" fill="none" opacity="0.2"/>
        <circle r="60" stroke="${t.ring}" stroke-width="8" fill="none" class="ring-circle" transform="rotate(-90)"/>
        
        <text x="0" y="-10" text-anchor="middle" class="curr-streak-value">${currentStreak}</text>
        <text x="0" y="15" text-anchor="middle" class="stat-label">Current Streak</text>
        
        <!-- Fire Icon -->
        <path class="fire-icon" transform="translate(-12, 30) scale(1)" fill="${t.fire}" d="M10.875 1.763c-.02.433-.315.823-.538 1.144-.805 1.155-1.92 1.996-2.913 2.993-.997 1.001-1.742 2.215-1.896 3.655-.078.718.069 1.341.317 1.914.3.693.81 1.258 1.378 1.73.064.053.155.104.22.02.062-.082-.008-.184-.047-.26-.713-1.396-.1-2.923.774-4.135.251-.349.529-.687.828-1.002.825-.87 1.636-1.764 2.126-2.883.257-.588.368-1.226.315-1.867-.015-.178-.041-.354-.076-.528-.016-.082-.128-.052-.164.02-.07.135-.125.292-.224.399zm-4.75 3.52c.006.184.055.362.115.534.225.642.668 1.154 1.168 1.618.596.554 1.272.986 2.038 1.218.423.128.868.182 1.309.183.178 0 .438-.013.564-.15.111-.121.084-.33.024-.486-.41-1.077-1.278-1.777-2.127-2.483-.497-.413-1.096-.913-1.428-1.487-.193-.334-.316-.704-.372-1.085-.018-.124-.183-.16-.23-.046-.388.948-.962 1.838-1.061 2.921z"/>
      </g>

      <!-- Right: Longest Streak -->
      <g transform="translate(350, 80)">
         <text x="0" y="0" class="stat-label">Longest Streak</text>
        <text x="0" y="30" class="stat-value">${longestStreak}</text>
        <text x="0" y="50" font-size="10" fill="${t.text}" opacity="0.7">All Time</text>
      </g>

    </svg>
  `;
};

module.exports = renderStreakCard;
