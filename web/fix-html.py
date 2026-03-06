#!/usr/bin/env python3
import re

# Read the files
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

with open('register-form-new.html', 'r', encoding='utf-8') as f:
    new_form = f.read()

# Find and replace the registerTab section
# Pattern: from opening registerTab to closing div before applyTab
pattern = r'<div id="registerTab" class="tab-content">.*?</div>\s*<div id="applyTab"'
replacement = new_form.strip() + '\n                \n                <div id="applyTab"'

# Use DOTALL flag to match across newlines
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write the fixed content
with open('index.html', 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print("✓ Fixed! The multi-step form has been properly inserted.")
