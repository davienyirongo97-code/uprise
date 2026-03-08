const fs = require('fs');

const content = fs.readFileSync('web/index.html', 'utf8');

// Add the script tag after app-enhanced.js
const updated = content.replace(
    '        <script src="app-enhanced.js"></script>\n        <script>',
    '        <script src="app-enhanced.js"></script>\n        <script src="clickable-stats.js"></script>\n        <script>'
);

fs.writeFileSync('web/index.html', updated, 'utf8');

console.log("Script tag added successfully!");
