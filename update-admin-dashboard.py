#!/usr/bin/env python3
"""
Script to update the admin dashboard to match the screenshot exactly
"""

import re

# Read the HTML file
with open('web/index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# New admin tabs HTML
new_admin_tabs = '''                <div class="admin-tabs">
                    <button class="admin-tab-btn active" onclick="showAdminTab('overview')">
                        <i class="fas fa-chart-pie"></i> Overview
                    </button>
                    <button class="admin-tab-btn" onclick="showAdminTab('loans')">
                        <i class="fas fa-file-invoice-dollar"></i> Loans
                    </button>
                    <button class="admin-tab-btn" onclick="showAdminTab('branches')">
                        <i class="fas fa-code-branch"></i> Manage Branches
                    </button>
                    <button class="admin-tab-btn" onclick="showAdminTab('settings')">
                        <i class="fas fa-cog"></i> Settings
                    </button>
                </div>'''

# New overview section header
new_overview_header = '''                    <div class="overview-section">
                        <h3>System Analytics & Performance</h3>
                    </div>'''

# New stats cards HTML
new_stats_cards = '''                    <div class="stats">
                        <div class="stat-card">
                            <div class="stat-icon stat-icon-blue"><i class="fas fa-users"></i></div>
                            <div class="stat-content">
                                <p class="stat-label">Total Clients</p>
                                <h3 id="systemClientCount" class="stat-number">12</h3>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon stat-icon-green"><i class="fas fa-chart-line"></i></div>
                            <div class="stat-content">
                                <p class="stat-label">Active Loans</p>
                                <h3 id="systemActiveLoans" class="stat-number">8</h3>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon stat-icon-yellow"><i class="fas fa-wallet"></i></div>
                            <div class="stat-content">
                                <p class="stat-label">Total Disbursed</p>
                                <h3 id="systemDisbursed" class="stat-number">MK 25.0M</h3>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon stat-icon-orange"><i class="fas fa-exclamation-triangle"></i></div>
                            <div class="stat-content">
                                <p class="stat-label">Default Rate</p>
                                <h3 id="systemDefaults" class="stat-number">15%</h3>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon stat-icon-lightblue"><i class="fas fa-clock"></i></div>
                            <div class="stat-content">
                                <p class="stat-label">Pending Review</p>
                                <h3 id="systemPendingReview" class="stat-number">4</h3>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon stat-icon-purple"><i class="fas fa-check-circle"></i></div>
                            <div class="stat-content">
                                <p class="stat-label">Approved Total</p>
                                <h3 id="systemApprovedTotal" class="stat-number">8</h3>
                            </div>
                        </div>
                    </div>'''

# New recent activity header
new_activity_header = '''                        <h2><i class="fas fa-history"></i> Recent Activity</h2>'''

print("Updating admin dashboard...")

# Replace admin tabs (find the pattern with emojis)
admin_tabs_pattern = r'<div class="admin-tabs">.*?</div>'
html_content = re.sub(admin_tabs_pattern, new_admin_tabs, html_content, count=1, flags=re.DOTALL)

# Replace overview section header
overview_pattern = r'<div class="overview-section">.*?</div>'
html_content = re.sub(overview_pattern, new_overview_header, html_content, count=1, flags=re.DOTALL)

# Replace stats cards (find the stats div with all 6 cards)
stats_pattern = r'<div class="stats">.*?</div>\s*</div>\s*<div class="section main-section">'
replacement = new_stats_cards + '\n\n                    <div class="section main-section">'
html_content = re.sub(stats_pattern, replacement, html_content, count=1, flags=re.DOTALL)

# Replace Recent Activity header
activity_pattern = r'<h2>Recent Activity</h2>'
html_content = re.sub(activity_pattern, new_activity_header, html_content, count=1)

# Write the updated HTML
with open('web/index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✓ Admin dashboard updated successfully!")
print("✓ Tabs now use Font Awesome icons")
print("✓ Stats cards have exact colors and layout from screenshot")
print("✓ Overview section header updated")
print("✓ Recent Activity header updated with icon")
print("\nRefresh your browser to see the changes!")
