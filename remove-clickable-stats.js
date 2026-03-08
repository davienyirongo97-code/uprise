const fs = require('fs');

let content = fs.readFileSync('web/index.html', 'utf8');

// Remove the clickable-stats.js script tag
content = content.replace(
    /\s*<script src="clickable-stats\.js"><\/script>\s*/g,
    '\n'
);

fs.writeFileSync('web/index.html', content, 'utf8');

console.log("Removed clickable-stats.js script tag!");
