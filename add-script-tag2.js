const fs = require('fs');

const content = fs.readFileSync('web/index.html', 'utf8');

// Add the script tag after app-enhanced.js using a more flexible regex
const updated = content.replace(
    /(<script src="app-enhanced\.js"><\/script>)/,
    '$1\n        <script src="clickable-stats.js"></script>'
);

fs.writeFileSync('web/index.html', updated, 'utf8');

console.log("Script tag added successfully!");
