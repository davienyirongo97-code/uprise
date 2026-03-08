#!/usr/bin/env python3
with open('web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the script tag after app-enhanced.js
content = content.replace(
    '        <script src="app-enhanced.js"></script>\n        <script>',
    '        <script src="app-enhanced.js"></script>\n        <script src="clickable-stats.js"></script>\n        <script>'
)

with open('web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Script tag added successfully!")
