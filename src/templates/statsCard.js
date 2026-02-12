const themes = {
  default: { bg: '#fff', text: '#333', icon: '#4c71f2', border: '#e4e2e2' },
  dark: { bg: '#151515', text: '#fff', icon: '#79ff97', border: '#e4e2e2' }, // Fixed typo in previous plan, using standard dark
  tokyonight: { bg: '#1a1b26', text: '#7aa2f7', icon: '#bb9af7', border: '#1a1b26' },
  radical: { bg: '#141321', text: '#a9fef7', icon: '#fe428e', border: '#141321' },
};

const renderStatsCard = (stats = {}, options = {}) => {
  const { name = 'User', totalStars = 0, totalCommits = 0, totalPRs = 0, totalIssues = 0, rank = 'C' } = stats;
  const {
    theme = 'default',
    hide_border = 'false',
    hide_rank = 'false',
    show_icons = 'true',
    custom_title,
    bg_color,
    text_color,
    title_color,
    icon_color,
    border_color
  } = options;

  const t = { ...themes[theme] } || { ...themes.default };

  // Custom Color Overrides
  if (bg_color) t.bg = `#${bg_color}`;
  if (text_color) t.text = `#${text_color}`;
  if (title_color) t.title = `#${title_color}`; // dedicated title color
  if (icon_color) t.icon = `#${icon_color}`;
  if (border_color) t.border = `#${border_color}`;

  if (!t.title) t.title = t.text; // Fallback if no specific title color in theme

  const border = hide_border === 'true' ? 'none' : `1px solid ${t.border}`;
  const showRank = hide_rank !== 'true';
  const showIcons = show_icons === 'true';

  // Rank Color Logic
  const rankColor = {
    'S': '#e3b341',
    'A+': '#1db954',
    'A': '#1db954',
    'B+': '#4c71f2',
    'B': '#4c71f2',
    'C': '#808080',
  }[rank] || t.text;

  const titleText = custom_title ? custom_title : `${name}'s GitHub Stats`;

  return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.title}; }
        .stat { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.text}; }
        .rank-text { font: 800 24px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${rankColor}; }
        .rank-label { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.text}; }
        .icon { fill: ${t.icon}; display: ${showIcons ? 'block' : 'none'}; }
      </style>
      
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="${t.bg}" stroke="${hide_border === 'true' ? 'none' : t.border}" stroke-opacity="${hide_border === 'true' ? '0' : '1'}"/>
      
      <text x="25" y="35" class="header">${titleText}</text>
      
      <!-- Stars -->
      <g transform="translate(25, 60)">
        ${showIcons ? `<path class="icon" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>` : ''}
        <text x="${showIcons ? 25 : 0}" y="12.5" class="stat">Total Stars:</text>
        <text x="${showIcons ? 150 : 125}" y="12.5" class="stat">${totalStars}</text>
      </g>

      <!-- Commits -->
       <g transform="translate(25, 90)">
        ${showIcons ? `<path class="icon" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"/>` : ''}
        <text x="${showIcons ? 25 : 0}" y="12.5" class="stat">Total Commits:</text>
        <text x="${showIcons ? 150 : 125}" y="12.5" class="stat">${totalCommits}</text>
      </g>

      <!-- PRs -->
      <g transform="translate(25, 120)">
        ${showIcons ? `<path class="icon" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/>` : ''}
        <text x="${showIcons ? 25 : 0}" y="12.5" class="stat">Total PRs:</text>
        <text x="${showIcons ? 150 : 125}" y="12.5" class="stat">${totalPRs}</text>
      </g>

      <!-- Issues -->
      <g transform="translate(25, 150)">
        ${showIcons ? `<path class="icon" d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0 0v-3m0 3v3m0-3h3m-3 0H5m3 7a7 7 0 110-14 7 7 0 010 14z"/>` : ''}
        <text x="${showIcons ? 25 : 0}" y="12.5" class="stat">Total Issues:</text>
        <text x="${showIcons ? 150 : 125}" y="12.5" class="stat">${totalIssues}</text>
      </g>

      <!-- Rank Circle -->
      ${showRank ? `
      <g transform="translate(350, 40)">
        <circle cx="50" cy="50" r="40" stroke="${rankColor}" stroke-width="4" fill="none" opacity="0.3"/>
        <circle cx="50" cy="50" r="40" stroke="${rankColor}" stroke-width="4" fill="none" stroke-dasharray="251" stroke-dashoffset="50" transform="rotate(-90 50 50)"/>
        <text x="50" y="55" text-anchor="middle" class="rank-text">${rank}</text>
        <text x="50" y="110" text-anchor="middle" class="rank-label">RANK</text>
      </g>
      ` : ''}
    </svg>
  `;
};

module.exports = renderStatsCard;
